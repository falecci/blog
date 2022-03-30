---
title: Save debugging time when using Sinon stubs
date: "2022-03-30"
description: Avoid a common pitfall with Sinon stubs
tags: ['sinon', 'testing']
---

Let's say we have the following function that we want to test.

```ts
export default class ItemCommands {
    constructor(private readonly _dbClient: DatabaseClient<Item>) {}

    async getItemStock(id: string): number {
        const item = await this._dbClient.find<Item>(id);

        return item.stock;
    }
}
```

The most common way to do it would be making a [stub](https://en.wikipedia.org/wiki/Method_stub) for `_dbClient` and pass it when creating a new instance of `ItemCommands`. One easy way to create stubs in our tests is using [`Sinon`](https://sinonjs.org/) package.

```ts
describe('ItemCommands tests', () => {
    let sandbox: sinon.SinonSandbox;
    let dbStub: sinon.SinonStubbedInstance<DatabaseClient>;
    let itemCommands: ItemCommands;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        dbStub = sandbox.createStubInstance(DynamoClient);
        itemCommands = new ItemCommands(dbStub as DatabaseClient);
    });
})
```

## The common pitfall

The problem I see very often is when we need to mock some call from our stub.

```ts
it('retrieves an item by id', async () => {
    const fakeId = 24;
    const fakeItem = {
        id: fakeId,
        name: 'iPhone XR',
        stock: 10,
    };

    dbStub.find
        .withArgs(fakeId)
        .resolves(fakeItem);

    const result = await itemCommands.get(fakeId);

    expect(result).toEqual(fakeItem.stock);
})
```

This test will obviously pass, but what would happen if we pass a wrong id instead?

```ts
it('retrieves an item by id', async () => {
    const fakeId = 24;
    const fakeItem = {
        id: fakeId,
        name: 'iPhone XR',
        stock: 10,
    };

    dbStub.find
        .withArgs(34) // called with a wrong id
        .resolves(fakeItem);

    const result = await itemCommands.get(fakeId);

    expect(result).toEqual(fakeItem.stock);
})
```

When running the test again, the code will throw an exception because it can't read `stock` from `undefined` and it will show us the stacktrace on our code.

```ts
TypeError: Cannot read property 'stock' of undefined
```

**What's going on?** We are telling our `dbStub.find` stub: _Hey, whenever someone calls you with `id 34`, return the `fakeItem`_. But we are calling `itemCommands.get` with `fakeId` which is `24`, and eventually it will call our stub with `id 24` instead of `id 34`. Our stub will read that id and say: _id 24? Nope, my business is with id 34_, so it will just return `undefined` instead of our `fakeItem`.

The example might be silly and easy to fix, but when dealing with larger code bases and our day by day, it's probable to fall into one of this and start debugging our tests.

**Is there any way we can a better error message and still assert that our stub was called with the right arguments?** Yes, there is!

## The solution

The first thing we should do is getting rid of the `withArgs` call on our stub. So every time `dbClient.find` is called in our code, it will just return the `fakeItem`.

Now you would ask: _But then how can we make sure it's getting called with the right id?_

Welp, we can add an [extra assert on our sinon stub](https://sinonjs.org/releases/latest/assertions/) at the end.

```ts
it('retrieves an item by id', async () => {
    const fakeId = 24;
    const fakeItem = {
        id: fakeId,
        name: 'iPhone XR',
        stock: 10,
    };

    // We remove the .withArgs(fakeId) call
    dbStub.find.resolves(fakeItem);

    const result = await itemCommands.get(fakeId);

    expect(result).toEqual(fakeItem.stock);

    // Extra sinon assert to verify our find stub was called 
    // only once and with the right arguments.
    sinon.assert.calledOnceWithExactly(dbStub.find, fakeId);
})
```

In this scenario, if there is a mismatch between the arguments, it will show a helpful message like this. In our terminal, it will show the expected vs final argument in red and green respectively.

```ts
AssertError: expected find to be called once and with exact arguments 
24 34
```

We can see now that the difference is super clear and much better to deal with, instead of just an exception that will consume us, hopefully little, time.

Of course, there are times when we will want to use `withArgs`, especially if we are calling the same stub multiple times but with different arguments and we do want to return different results.

But in my experience, most of the time we would be super okay with this pattern of stubbing and asserting.