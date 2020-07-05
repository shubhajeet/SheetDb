# SheetDb
Google app script library that lets you use google sheet like a key value pair database.

# Usage 

ProjectId:Mh3fuMDJ6YrJ-WBuWKeMtlj6333tZbdFa

Go to Resources > Libraries and add the above library using the above project id.

# Learn By Example

## Open a spreadhseet as sheetdb
```js
var sid = "1Y6N-jNCF23TyE8WbV8FEEfUcdDDCw5IlvNt9wCOwg9w";
db = new SheetDb(sid,"SheetName");
```

## Add record
```js
let value = {"first_name":"sujit","last_name":"maharjan"};
db.set(value);
```

## Read record
```js
let value = db.get({"first_name":"sujit"});
```

## Update record
```js
db.update({"first_name":"sumit"},{"first_name"":"sujit"});
```

## Delete record
```js
db.removeRows({"first_name":"sujit"});
```
