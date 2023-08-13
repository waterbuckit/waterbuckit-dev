import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark as dark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import whoWouldWin from "../../images/blog-images/promise-all-is-stinky/who-would-win.png";

const basicPromise = `const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Hello World!');
    })
  })
  .then((value) => console.log(value))
  .catch((err) => console.log(err));
`;

const asyncAwait = `const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Hello World!');
    })
  });

const main = async () => {
  const value = await p;
  console.log(value); // "Hello World!"
}

main();`;

const promiseAll = `const fetchFoos = async () => {
  const fetchFoo = async (id: number) => fetch(\`/api/foos/\${id}\`);

  const bar = await Promise.all([
    fetchFoo(1), 
    fetchFoo(2), 
    fetchFoo(3)
  ]);

  return bar;
}

const main = async () => {
  const value = await fetchFoos();
  console.log(value); // [...]
}

main();
`;

const promiseAllWithError = `const fetchFoos = async () => {
  const fetchFoo = async (id: number) => {
    const result = await fetch(\`/api/foos/\${id}\`);

    console.log(id, result);

    return result;
  }

  const bar = await Promise.all([
    fetchFoo(1), 
    Promise.reject('zoinks'), 
    fetchFoo(3)
  ]);

  return bar;
}

const main = async () => {
  try { 
    const value = await fetchFoos();
    console.log(value); // [...]
  } catch (err) {
    console.log(err); // "zoinks!"
  }
}

main();
`;

const promiseAllWithErrorOutput = `1 Response { ... }
zoinks! // this is our catch block in main!?
3 Response { ... }
`;

const promiseSettledResult = `type PromiseFulfilledResult<T> = { status: 'fulfilled', value: T };
type PromiseRejectedResult = { status: 'rejected', reason: any };
type PromiseSettledResult<T> = 
| PromiseFulfilledResult<T> 
| PromiseRejectedResult;`;

const promiseAllSettledWithError = `const fetchFoos = async () => {
  const fetchFoo = async (id: number) => {
    const result = await fetch(\`/api/foos/\${id}\`);

    console.log(id, result);

    return result;
  }

  const bar = await Promise.allSettled([
    fetchFoo(1), 
    Promise.reject('zoinks'), 
    fetchFoo(3)
  ]);

  return bar;
}

const main = async () => {
  try { 
    const value = await fetchFoos();
    console.log(value); // [...]
  } catch (err) {
    console.log(err); // "zoinks!"
  }
}

main();
`;

const promiseAllSettledWithErrorOutput = `1 Response { ... }
3 Response { ... }
[{
  status: 'fulfilled',
  value: Response { ... }
},
{
  status: 'rejected',
  reason: 'zoinks'
},
{
  status: 'fulfilled',
  value: Response { ... }
}]
`;

const promiseAllSettledFilteredFulfilledWithTsError = `const main = async () => {
  try { 
    const value = await fetchFoos();
      
    const fulfilled = value
      // filter out rejected promises
      .filter((v) => v.status === 'fulfilled')
      // log the value of each fulfilled promise
      .forEach((v) => console.log(v.value));

  } catch (err) {
    console.log(err); // "zoinks!"
  }
}

main();
`;

const promiseAllSettledFilteredFulfilled = `const main = async () => {
  try { 
    const value = await fetchFoos();
      
    const fulfilled = value
      // filter out rejected promises
      .filter((v): is PromiseFulfilledResult<Response> => 
        v.status === 'fulfilled')
      // log the value of each fulfilled promise
      .forEach((v) => console.log(v.value));

  } catch (err) {
    console.log(err); // "zoinks!"
  }
}

main();
`;

const callBackHell = `getUser(1)
.then((user) => {
  getPosts(user.id)
    .then((posts) => {
      posts.forEach((post) => {
        getComments(post.id)
          .then((comments) => {
            comments.forEach((comment) => {
              getReplies(comment.id).then((replies) => {
                replies.forEach((reply) => {
                  getLikes(reply.id).then((likes) => {
                    console.log(\`there are a few likes \${likes.length}\`)
                  })
                  .catch((err) => {
                    console.error(\`Failed to fetch likes for reply \${reply.id}: \${err}\`);
                  });
                });
              }).catch((err) => {
                console.error(\`Failed to fetch replies for comment \${comment.id}: \${err}\`);
              });
            })
          })
          .catch((err) => {
            console.error(\`Failed to fetch comments for post \${post.id}: \${err}\`);
          });
      });
    })
    .catch((err) => {
      console.error(\`Failed to fetch posts for user \${user.id}: \${err}\`);
    });
})
.catch((err) => {
  console.error(\`Failed to fetch user: \${err}\`);
});`;

const PromiseAllIsStinky = () => {
  return (
    <>
      <p>
        I think we can all agree that asynchronous code is a beast. The moment
        the control flow becomes non-sequential, when it feels like lines are
        not being sequentially executed, it becomes a nightmare to debug or even
        reason about. This is why we have promises, to help us tame the beast.
        But even promises tend towards satanic behavior when we need to await a
        set of them before we allow our code to proceed its execution. This is
        where <code>Promise.all</code> comes in.
      </p>
      <h2>A quick run-down on promises 🤝</h2>
      <p>
        Promises are a pattern for handle asynchronous code in a more
        synchronous manner. They are a way to represent a value that will
        potentially be available in the future. Fundamentally, they encapsulate
        some state: pending, fulfilled, or rejected. When pending, we have no
        value, when fulfilled, the <code>Promise</code> has a value, and when
        rejected, the <code>Promise</code> has an error. Likewise, promises
        should also have a way to handle each of these states - essentially
        callbacks that are called when the state changes.
      </p>
      <p>
        I'll be using JavaScript/TypeScript promise implementation for this
        explanation, but fundamentally it should be the same for any language
        implementing this pattern.
      </p>
      <h3>
        The <code>Promise</code> class
      </h3>
      <p>
        This class essentially encapsulates our fulfilled, pending and rejected
        states. It has a constructor that takes a function with two arguments:
        <code>resolve</code> and <code>reject</code>. These are the callbacks
        that are called when the <code>Promise</code> is fulfilled or rejected.
        Likewise, the <code>Promise</code> allows the developer to register
        callbacks for when the <code>Promise</code> is fulfilled or rejected.
        These are the <code>then</code> and <code>catch</code> methods
        respectively.
        <SyntaxHighlighter language="typescript" style={dark}>
          {basicPromise}
        </SyntaxHighlighter>
        Following the example above, the <code>Promise</code> is fulfilled when
        the timeout is complete (no argument was passed, so this will just be
        instant, however will still deviate from the usual synchronous flow).
        The <code>then</code> method is called with the value passed to
        <code>resolve</code>, and the <code>catch</code> method is never called.
      </p>
      <h3>
        Sweet sweet syntactic sugar (like a 100% sugar boba): <code>async</code>{" "}
        and <code>await</code> 🥺
      </h3>
      <p>
        It's almost universally acknowledged that using callbacks for handling
        asynchronous control flow is asking for a brisk and painful death. This
        is where the rather miserably neologised term "callback hell" comes
        from. See artwork below:
        <SyntaxHighlighter language="typescript" style={dark}>
          {callBackHell}
        </SyntaxHighlighter>
        Note how we can literally fit{" "}
        <a href="https://en.wikipedia.org/wiki/Olympus_Mons">Olympus Mons</a> in
        that indentation on the left.
        <br /><br />
        This is why we have <code>async</code> and{" "}
        <code>await</code>. These two simple keywords are essentially wrappers
        around promises that make them look synchronous. The <code>async</code>{" "}
        keyword is used to mark a function as asynchronous, and the{" "}
        <code>await</code> keyword is used to wait for a promise to resmx-auto
        continuing execution. See this in action:
        <SyntaxHighlighter language="typescript" style={dark}>
          {asyncAwait}
        </SyntaxHighlighter>
        In the above example, <code>p</code> is "eagerly" evaluated (that is to
        say, the callback of the promise is called at the earliest possible
        opportunity), but this could take time given however long our timeout
        takes to resolve or reject.
      </p>
      <p>
        It's important to understand exactly how the above could be the same as
        using
        <code>then</code> and <code>catch</code> callbacks. Note how the
        function must be declared as <code>async</code> - and await <i>can</i>{" "}
        only be used in functions - this is because the interpreter needs to
        know that this function will implicitly return a <code>Promise</code>.
        When you use the <code>await</code> keyword within an async function,
        it's essentially telling JavaScript to pause the execution of that
        function until the <code>Promise</code> being awaited resolves. While
        waiting for the
        <code>Promise</code> to resolve, the JavaScript engine can continue
        executing other code outside of this function. When an asynchronous
        operation is encountered within an async function, it returns a{" "}
        <code>Promise</code> immediately. The await keyword then awaits the
        resolution of this <code>Promise</code>. If the
        <code>Promise</code> is already resolved, the execution continues
        immediately. If the
        <code>Promise</code> is pending, the async function is paused and
        control is returned to the event loop, allowing other tasks to execute.
      </p>
      <p>
        The JavaScript runtime environment, like a web browser or Node.js, has
        an event loop that continuously checks the state of Promises and other
        tasks. When a Promise is resolved, it's moved from the pending state to
        the resolved state, and the event loop schedules the corresponding then
        callback. When the awaited <code>Promise</code> resolves, the event loop
        schedules the continuation of the async function's execution. The
        function resumes from where it was paused by the await keyword. If the
        awaited <code>Promise</code> is rejected, an exception is thrown, which
        can be caught using a try/catch block.
      </p>
      <h2>
        Ok mansplainer, what's the problem with <code>Promise.all</code> then?
      </h2>
      <p>
        <code>Promise.all</code> is a function that takes an array of promises
        and will simply await all of them before returning a resolved promise
        with an array of all the results. Great! Quite simple, and very handy
        for cases like the following, where several requests need to be made
        simultaneously and we want to wait for all of them to complete before
        continuing execution:
        <SyntaxHighlighter language="typescript" style={dark}>
          {promiseAll}
        </SyntaxHighlighter>
        Above, we're simply making three requests to the same endpoint with
        different parameters, say, we want foo with id 1, foo with id 2, and foo
        with id 3 but we need the data for all three foos before continuing
        execution - our log statement will only run once all three promises have
        successfully completed.
      </p>
      <p>
        The problem arises when we handle our errors. If any of the promises
        fail, the <code>Promise.all</code> will reject with the error of the
        first promise that fails, however, subsequent promises will still
        continue to be evaluated - remember what I said about promises being
        eager beavers?! 🦫
      </p>
      <p>
        Take the above example, and let's have an error thrown in the second
        promise:
        <SyntaxHighlighter language="typescript" style={dark}>
          {promiseAllWithError}
        </SyntaxHighlighter>
        The example above is a modified version of our first example, but the
        difference is subtle. Notice the second element of the array is an
        rejected promise? This will cause our <code>Promise.all</code> to
        reject, and the error will be the error thrown by the second promise.
        However, the third promise will still be evaluated, and the{" "}
        <code>console.log</code> statement will still run. Our output will end
        up something like:
        <SyntaxHighlighter style={dark}>
          {promiseAllWithErrorOutput}
        </SyntaxHighlighter>
        Note how we essentially ended up back in our `main` function while other
        promises were still resolving? This is not ideal, and will lead to an
        absolutely flattened pair of buttocks as you try to figure out why your
        async code is not behaving as expected.
      </p>
      <h2>
        The "solution" <code>Promise.allSettled</code> 🫠
      </h2>
      <p>
        You can already see where this is going, I added the quotation marks to
        make sure you did. The solution isn't great. Functionally, it works, but
        as a developer who cares about knowing the types of my data at all
        points in my code, it is unto us a great evil.
      </p>
      <h3>Promise.allSettled</h3>
      <p>
        Like <code>Promise.all</code>, <code>Promise.allSettled</code> takes an
        array of promises and returns an array of results. The difference is
        that <code>Promise.allSettled</code> returns a generic type:
        <code>PromiseSettledResult</code>. As a type alias you could describe it as the
        following:
        <SyntaxHighlighter language="typescript" style={dark}>
          {promiseSettledResult}
        </SyntaxHighlighter>
        From the above we can see that the <code>PromiseSettledResult</code>, as
        an array, will contain either a <code>PromiseFulfilledResult</code> or a{" "}
        <code>PromiseRejectedResult</code>.
      </p>
      <h3>Nice, an array, clever man, how is our problem solved though?</h3>
      <p>
        Let's take a look at a tweaking of our previous example, but this time
        using
        <code>Promise.allSettled</code>:
        <SyntaxHighlighter language="typescript" style={dark}>
          {promiseAllSettledWithError}
        </SyntaxHighlighter>
        Okay, all vaguely familiar, nothing special happening, let's take a look
        at our result:
        <SyntaxHighlighter style={dark}>
          {promiseAllSettledWithErrorOutput}
        </SyntaxHighlighter>
        Nice, so <code>Promise.allSettled</code> is catching our error for us
        and aggregating it as a <code>PromiseRejectedResult</code> in our array.
        This is great, and the over all result is considered a fulfilled promise
        without being unnaturally returned to <code>main</code>! 🎉
      </p>
      <h3>So wherefore cometh thus the stench!? 🤷‍♂️</h3>
      <p>
        I want to know my types. At all times, I want to know my types. If I
        don't know my types, a whole new class of issues beyond just "business
        logic" are introduced. Constant uncertainty. Parallysis! Relatable,
        right? 🤣
      </p>
      <p>
        Let's say I want to just get all my fulfilled promises from the array we
        generated in the above example:
        <SyntaxHighlighter language="typescript" style={dark}>
          {promiseAllSettledFilteredFulfilledWithTsError}
        </SyntaxHighlighter>
        This doesn't look nefarious, but pass this through a TypeScript compiler
        and it'll have a hard time. It isn't clever enough to determine that
        after running that filter, the discriminated union (🤮) will only
        contain
        <code>PromiseFulfilledResult</code> objects. It will still think it
        could be a <code>PromiseRejectedResult</code> object! So there goes our
        DX that we so desperately craved, and to what we pray to for our own
        sanity as developers in some vain attempt to keep our code clean and our
        minds clear.
      </p>
      <h3>
        Wise Adam, I'm sure you've thought of a solution, what <i>is</i> it?
      </h3>
      <p>
        And here is where I remind you of a very important programming axiom
        <blockquote>
          <i>
            your solution will induce a soupcon of back-of-the-throat vomit in
            the reader, and you will probably be the reader
          </i>
        </blockquote>
        So, no matter how grim it is, no one will care about that one line as
        much as you do, so just do it, and don't pester me constantly about
        trifles.
      </p>
      <p>
        So here's the best solution my measly brain could come up with:
        <SyntaxHighlighter language="typescript" style={dark}>
          {promiseAllSettledFilteredFulfilled}
        </SyntaxHighlighter>
      </p>
      <h2>
        Conclusion: <code>Promise.allSettled</code> is stinky 🤢
      </h2>
      <p>
        Try as we might, there's not a perfect answer to this problem,
        especially not in TypeScript. But we can quite easily manouvre around
        the APIs provided to us and write code that is both readable and safe.
      </p>
      <p>
        Just don't send your rocket to Mars running TypeScript promises in your
        inertial reference system. I'm sure it'll be fine, but I'm not sure I'd
        want to be the one to find out.
      </p>
      <img src={whoWouldWin} alt="big expensive rocket vs binary arithmetic" />
      <p>Happy absconding! 🚀</p>
    </>
  );
};

export default PromiseAllIsStinky;
