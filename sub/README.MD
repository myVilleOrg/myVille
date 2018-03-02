# myVille FrontEnd
Before launch project :
```
npm install && bower install
npm install -g grunt-cli
bower install ngstorage
```
To launch :
```
grunt serve
```

### Coding conventions

Don't put spaces before if and for parentheses.

Put spaces around comparaison signs (`=`, `<`, `===`, `+`, `:`).

Try using `===` instead of `==` as much as possible.

```
if(x === 1) x++;
for(var i = 0; i < 5; i++) console.log('Hello ' + i);

var object = {
	key:value, // WRONG
	key :value, // WRONG
	key : value // WRONG
	key: value, // RIGHT
}
```
Try aligning lines that match together.
Avoid using switch.
Only use single quotes
Use empty lines only for logic separation. Never use more than 1 separation line.
Indent using tabs and not spaces (tab length = 4 spaces)
