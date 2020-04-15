Simple Trie implementation in javascript released in public domain

```javascript
let trie = new Trie();
let somePOJO = {with: 'values', in: 'it'};
trie.add('searchable ascii string', somePOJO);
let results = trie.search('searchable asci');
if (results.length > 0) {
    console.log(results[0] === somePOJO); // => true
}
```
