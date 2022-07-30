# About IndexedDB

If/when the Internet is down, we need a way of storing database content in thr browser. We
can't use cookies for this, and localStorage isn't robust enough real database-type data.

So we use a relatively new technology called indexedDB. *Loosely* based on NoSQL, indexedDB is a 
full-fledged database that lives in the browser. You can queries against it, and treat it in 
many respects like a real database.

So why isn't it used more? Mainly because the architecture and syntax for IndexedDB are very 
non-intuitive. And although having a full-fledged database in the browser sounds awesome, it 
really only has fairly limited use cases, since the database is always specific to whatever 
browser it's stored in.

For more information on IndexedDB [look here](https://web.dev/indexeddb/).