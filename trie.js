// 256 ASCII Trie search
// This is free and unencumbered software released into the public domain.
// For more information, please refer to <https://unlicense.org>

const ASCII_CODES = 256;

class TrieNode {
    constructor() {
        this.children = new Array(ASCII_CODES);
        this.values = [];
    }

    // get index of word and insert node
    // returns true if successful
    //         false if node already exists
    insert(word, node) {
        const index = this._characterToIndex(word);

        if (!this.getChild(index)) {
            this.insertChild(index, node);
            return true;
        }

        return false;
    }

    insertValue(value) {
        this.values.push(value);
    }

    getValues() {
        return [...this.values];
    }

    // returns child by index
    getChild(index) {
        return this.children[index];
    }

    getChildForWord(word) {
        const index = this._characterToIndex(word);
        const child = this.getChild(index);
        if (!child) {
            // console.log('No child for"', word, '" got index', index, this.children);
        }
        return child;
    }

    // inserts child node by index
    insertChild(index, node) {
        this.children[index] = node;
    }

    // maps first character of word to child index
    _characterToIndex(word) {
        if (word.length === 0) {
            throw new Error("passed empty string");
        }

        const index = word.toLowerCase().charCodeAt(0);

        if (index < 0 || index >= ASCII_CODES) {
            throw new Error("Can't handle word: " + word);
        }

        return index;
    }
}

export default class Trie {
    results = {};
    root = new TrieNode();

    add(searchableString, value) {
        if (!searchableString) {
            return false;
        }
        searchableString = searchableString.toLowerCase();
        if (this.results[searchableString]) {
            return false;
        }

        // console.log('Inserting value into trie: ', searchableString, value);

        let node = this.root;

        const characters = searchableString.split('');
        characters.forEach((character) => {
            let child = node.getChildForWord(character);
            if (!child) {
                child = new TrieNode();
                // console.log('Inserting trie node for character', character);
                node.insert(character, child);
            }

            node = child;
        });

        const newValue = JSON.stringify(value);
        const values = node.getValues();
        for (let i = 0; i < values.length; i++) {
            const existingValue = JSON.stringify(values[i]);
            if (existingValue === newValue) {
                // already inserted
                // console.log('Value already inserted for', searchableString);
                return false;
            }
        }

        node.insertValue(value);
        // console.log('Successfully inserted value into trie');
        this.results[searchableString] = true;
        return true;
    }

    search(prefix) {
        // console.log('Searching trie for value "', prefix, '"');
        if (!prefix || prefix.length === 0) {
            return [];
        }

        prefix = prefix.toLowerCase();

        const characters = prefix.split('');
        const child = characters.reduce(
            (accumulator, currentValue) => {
                if (!accumulator) return accumulator;

                const child = accumulator.getChildForWord(currentValue);
                // console.log('Trie child for character: ', currentValue, child);
                return child
            },
            this.root,
        );

        if (child) {
            // console.log('Found search node: ', child);
        } else {
            // console.log('No prefix found in trie', this.root);
        }

        const searchResults = this.getChildren(child, prefix);
        // filter duplicates
        const set = {};
        searchResults.forEach(result => set[JSON.stringify(result)] = result);

        searchResults.length = 0;
        const keys = Object.keys(set);
        for (let i = 0; i < keys.length; i++) {
            searchResults.push(set[keys[i]]);
        }

        return searchResults;
    }

    // get children search results
    // prefix results with prefix
    getChildren(node) {
        if (!node) {
            return [];
        }
        // getValues makes a copy of the value set
        const children = node.getValues();

        for (let i = 0; i < node.children.length; i++) {
            // use simple recursion
            // there isn't going to be a college with a 2000 character name
            // that will blow the stack
            // if there is, use an array of nodes
            const child = node.children[i];
            if (!child) continue;

            const results = this.getChildren(child);
            // push each child onto the result set
            for (let j = 0; j < results.length; j++) {
                children.push(results[j]);
            }
        }

        return children;
    }
}
