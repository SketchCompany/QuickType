# Quick Type Language Support

This is the official node package, made for the official programming language `Quick Type`, which is developed by the Sketch Company.
If you want to write short code and like to have the same results as in javascript, this is the perefect option for you!
You only need to install this package on your computer and after that you can start writing in Quick Type.
If you'd like to have some language support for Quick Type, you can install the [VS Code "Quick Type Language Support" extension](https://marketplace.visualstudio.com/items?itemName=SketchCompany.qt-ls-sc).

## Usage
If you'd like to know how to use `Quick Type`, you can visit our documentation at [our documentation website](https://docs.sketch-company.de).

## Changelog
This is the changelog of the language, not really the node package itself, because the version of the node package changes more often than the language itself. So don't worry about the versions, that the changelog shows, they are correct.

## 0.0.4
- fixed bugs when using for loops and arrays
- fixed issue when using if statements with the `&` (and) or `|` (or) operator
- fixed other small bugs

## 0.0.3
> [!WARNING]
> Support for `.qt` file extensions has been stopped and does not work anymore!

> [!NOTE]
> We recommend using the `.quick` extension, if you are using the `import` functionality, because it can only import files with `.quick` extension.

<br>

<details><summary><b>added import functionality by using "quicky"</b></summary><br>

To import a script, use the keyword `quicky` (stands for "quickly import a .quick file") followed by a string with the filename without the `.quick` extension

<br>

`mainScript.quick`
```js
quicky "anotherScript"

log("a variable from antoher script", anotherScript.aVariable)

log("a test function from another script", antoherScript.testFunction())
```

To export data of a script (file), you define a variable at the very end of it.

<br>

`anotherScript.quick`
```js
log("anotherScript: test")

f testFunction(){
   log("anotherScript: testFunction called")
   c testFunctionString = "anotherScript: testFunction called"
}

c aVariable = true
c anotherVariable = "anotherScript: test"

// here we define the varibale to export the data of the script
c export = {
    aVariable,
    testFunction,
    anotherVariable
}
```
</details>

<details><summary><b>added HTML support</b></summary><br>

You can now assign HTML to variables by using the `</>` symbol.

<br>

`htmlSupport.quick`
```html
c html = </>
<html>
    <head>
        <style>
            body{
                background-color: whitesmoke;
                color: black;
                padding: 50px 100px;
                margin: 0;
            }
        </style>
    </head>
    <body onload="test()">
        <h1>Test Website<h1>
        <p>This is an example website<p>
    </body>
    <script>
        function test(){
            alert("test function was called")
        }
    </script>
</html>

log("html", html)
```

This can be used in the future for creating a REST API and sending HTML to the frontend.
That will be possible in future updates of Quick Type.

</details>

<details><summary><b>todo: add variable support for html</b></summary><br>

So you could do something like this

<br>

`future.quick`
```html
c localTime = time()
c html = </>
<html>
    <head>
        <style>
            body{
                background-color: whitesmoke;
                color: black;
                padding: 50px 100px;
                margin: 0;
            }
        </style>
    </head>
    <body onload="test()">
        <h1>Test Website<h1>
        <p>This is an example website<p>

        <!-- example using variables in html -->
        <div>
            <h2>Local Time</h2>
            <p>localTime <!-- The Varibale defined at the top showing the local current time --></p>
        </div>

    </body>
    <script>
        function test(){
            alert("test function was called")
        }
    </script>
</html>

log("html", html)
```
</details>

- removed support for files with `.qt` extension
- support set only for `.quick` and `.quicktype` file extensions

## 0.0.2

<details><summary><b>added arrays</b></summary><br>

You can create an array by using the `[]` brackets like in every other programming language.

<br>

`arrays.quick`
```js
c array = [
    "first string",
    "second string",
    "third string"
]
c array2 = [
    0,
    1,
    2
]
log("array:", array2[0], array[0])
log("array:", array2[1], array[1])
log("array:", array2[2], array[2])
```
</details>

<details><summary><b>added for loops</b></summary><br>

You can use for loops for arrays like this

<br>

`forLoops.quick`
```js
c array = [
    "first string",
    "second string",
    "third string"
]

f readArray(element, i, newArray){ // these arguments are optional but recommended to use for tracking the elements in the array in the index
    log("array element", i, element)
    log("new array:", newArray)

    // do whatever you want to do with the element
} 

for(array, readArray)
```

You can also call a function for multiple times like this

<br>

`forLoops2.quick`
```js
c repetitions = 5

f readArray(i){ // this argument is also optional
    log("called function", i + 1, "times")
} 

for(repetitions, readArray)
```
</details>

<details><summary><b>added if, else if and else statements</b></summary><br>

To use if and else statements, you need to do it like in every other programming language.
Only the `&&` and `||` symbol are diffrent here! You have to use only a single symbol of them.

<br>

`ifAndElseStatements.quick`
```js
c state = true
c number = 2

f checkState(){
    
    // if statement
    if(state == true){
        log("state is true")
    }

    // if, else statement
    if(state != true){
        log("state is false")
    }
    else{
        log("state is true")
    }

    // if, else if, else statement
    if(number == 0){
        log("number is 0")
    }
    else if(number == 1){
        log("number is 1")
    }
    else{
        log("number is", number)
    }

    // if, else if, else statement
    if(number == 0 | number == 1){ // "|" also know as "||" stands for "or" and means that at least on condition has to apply
        log("number is 0 or 1")
    }
    else if(number == 1 & number <= 5){ // "&" also known as "&&" stands for "and" and means that both conditions have to apply
        log("number is 1 or number is 5 or lower")
    }
    else {
        log("idk the number")
    }
}

checkState()
```

You can also use keywords like `is` (equal to `==`), `not` (equal to `!=`), `gt` (stands for "greater than", euqal to `>`), `ls` (stands for "less than", equal to `<`), `ngt` (stands for "not greater than" equal to `!>`), `nls` (stands for "not less than", equal to `!<`), `isgt` (stands for "is equal or greater than", equal to `>=`), `isls` (stands for "is equal or less than", equal to `<=`).



`ifAndElseStatementsWithWords.quick`
```js
c state = true
c number = 2

f checkState(){
    
    // if statement
    if(state is true){
        log("state is true")
    }

    // if, else statement
    if(state not true){
        log("state is false")
    }
    else{
        log("state is true")
    }

    // if, else if, else statement
    if(number is 0){
        log("number is 0")
    }
    else if(number is 1){
        log("number is 1")
    }
    else{
        log("number is", number)
    }

    // if, else if, else statement
    if(number is 0 or number is 1){
        log("number is 0 or 1")
    }
    else if(number is 1 and number isls 5){
        log("number is 1 or number is 5 or lower")
    }
    else {
        log("idk the number")
    }
}

checkState()
```

</details>

- fixed some small bugs

## 0.0.1
- Release of the node package and the language