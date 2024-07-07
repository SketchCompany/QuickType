# Quick Type Language Support

This is the official node package, made for the official programming language "Quick Type", which is developed by the Sketch Company.
If you want to write short code and like to have the same results as in javascript, this is the perefect option for you!
You only need to install this package on your computer and after that you can start writing in Quick Type.
If you'd like to have some language support for Quick Type, you can install the [VS Code "Quick Type Language Support" extension](https://marketplace.visualstudio.com/items?itemName=SketchCompany.qt-ls-sc).

## Usage
If you'd like to know how to use "Quick Type", you can visit our documentation at [our documentation website](https://docs.sketch-company.de).

## Changelog
This is the changelog of the language, not really the node package itself, because the version of the node package changes more often than the language itself. So don't worry about the versions, that the changelog shows, they are correct.

## 0.0.3
> [!WARNING]
> Support for ".qt" file extensions has been stopped and does not work anymore!

> [!NOTE]
> We recommend using the ".quick" extension, if you are using the `import` functionality, because it can only import files with ".quick" extension.

<br>

<details><summary><b>added import functionality by using "quicky" followed by the name of the file to be imported without extension (.quick)</b></summary>

To import a script, use the keyword "quicky" (stands for "quickly import a .quick file") followed by a string with the filename without the ".quick" extension

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

<details><summary><b>added HTML support</b></summary>

You can now assign HTML to variables by using the "</>" symbol.

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

- fixed bugs with using for loops and arrays
- removed support for files with ".qt" extension
- support set only for ".quick" and ".quicktype" file extensions

<details><summary><b>todo: add variable support for html</b></summary>

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

## 0.0.2

<details><summary><b>added arrays</b></summary>

You can use array by using the "[]" brackets like in every other programming language.

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

<details><summary><b>added for loops</b></summary>

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

- added if, else if and else statements
- fixed some small bugs

## 0.0.1
- Release of the node package and the language