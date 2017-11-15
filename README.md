Displaying SF muni buses using d3.js and Vue

Problem Statement:
Displaying the base map of San Francisco and drawing the SF muni vehicle locations. on top of the map, dynamically updating the location every 15 seconds.
First, you will need to display a base map of San Francisco.

Framework: Vue
Libraries Used: D3.js, axios.js
Module Bundler: webpack

Vuejs:
Vue is a progressive framework that is focused on the view layer rather than having a modular structure and is easy to pickup and integrate with other libraries.In short you can think about it as V in MVC. It has a syntax very similar to AngularJs but the implementation can be compared very closely with React.
I just started learning Vue and am really liking it as I learn something new almost every day. These are some of the key features because of which I was driven towards Vue.

1. There are few benefits of using Vue over AngularJs ( the framework I used before   this). AngularJS has strong opinions about how your applications should be structured, while Vue is a more flexible, modular solution.

2. AngularJs uses 2-way data binding while Vue enforced on way data flow between components. This makes the flow of data easier to maintain.

3. Vue has a clear distinction between directives and components. Directives are for DOM manipulations only, while components are self-contained units that have data and logic. In Angular it is very easy to get confused between directives, services and controllers.

4. Vue has better performance and optimization because it does not use dirty checking

5. Vue also allows you to write components and the css required for the component in the same file, which proves very easy for reading the code, development and maintenance.

6. It keeps the overhead of introducing new technology very small.

7. Excellent Documentation.

I am currently learning and exploring the code structure using Vue. I still have a lot of learning to do. But I have learnt these few pointers in my process until now.

Single file components can get easily bloated which can not be very useful for future maintenance. The ideal way to structure the code would be as follows:

1. Splitting the complex components to be smaller components and handling the data via props.

2. Use computed property for complex logic.
   One can data-bind the computed properties in templates just like a normal property and vue would be aware of that. Also computed values are cached on their dependencies. This is a very powerful feature as we don’t have to use watch function to keep a check on data-change.

3. Make the component data-driven. This is the place I am working the most, as I am still very used to thinking the ‘angular’ way (DOM manipulation).

Axios:

I am using axios for fetching the api calls. Is it promise based http client for javascript.
There are many powerful things that you can do with axios. Here is the full list of feature list https://github.com/mzabriskie/axios:

	1.	You can set a base url that can be appended in every http call you would make
	2.	Intercept request and response
	3.	Cancel requests
	4.	Automatics transform of JSON Data.

Webpack:
Webpack is a module bundler. It is built tool that puts all your assets, including javascript, images and css in a dependency graph. Web pack comes with a small build in dev server, a small express app for local development. This helps you do live code updating and saves a lot of development time.

Setup:
Boilerplate Source: https://github.com/vuejs-templates/webpack
I used a vue boiler plate set up to get started with this project. It came with built in web pack set up which was nice to have.
Added d3.js, sass loader and axios packages

Implementation:

To run in your computer:
1. Clone the repository https://github.com/nehatrajan/muni-update
2. Npm install
3. Npm run dev (to run in your localhost)


Started with creating a vue instance.
Created a SfMuni component and inserted it in the main app.vue

Divided the problem into the following steps:

1. Drawing the sf map on svg. (Arteries, streets, neighborhoods, freeways)
2. Fetching all the possible routes for the MUNI from the nextBus Api.
        a) Storing the routes in the data property.
        b) I have created the data property as a function and not object as we are used to.
           This is because when the data property is a function, it returns a pre-instance value in component definition.
           This helps us to reference during render .This is called as reactive data properties.
        c) Also creating a computed value called routedList that is a array of objects of all routes. This is dependent of the route data, so it could be cached and will be updated every time the route is updated.
3. Rendering the route in the frontend and drawing it on top of the map
4. Fetching the bus data for each route using the Nextbus api.
5. Drawing circles in all the bus locations.
6. Calling the bus-data api every 15 seconds using the setTimeInterval.

Selection of a route:
1. Listing all the route-list as checkboxes in the html template.
        a) These values were calculated in the computed method mentioned above.
2. Binding the checkbox with the route-tag value, and passing it as a parameter with the on:change function.
3. Checking/Unchecking the checkbox sets the data-model (selectedRoute) and triggers the on:change function.
        a) When a checkbox is selected, reducing the opacity of all the other routes and    increasing the opacity of the route selected to highlight it.
        b) As it is a checkbox, it can handle multiselect and can highlight all the routes  selected.
        c) This is achieved by using the data-model (selectedRoutes) which is basically a list of all the routes selected in the checkbox.
        d) Deselecting the checkbox removes the value from the selectedRoute data model and removes the highlighted the route that was deselected.
        e) If there are no values selected in the checkbox, it shows all the routes with all the bus locations.

Conclusion:
Thank you for making me take this coding challenge. I really enjoyed the process.
I spent around 9 hours to complete the project. ~3 hours for 3 days. I feel there is potential to improve the project by using Vue to its full potential

Note:
I would like to separate the checkbox as its own component and would have liked to show the visual changes with the help of data-props.
This would make the code more structures and reduce the number of methods in the sf-muni component.
I was not able to achieve this being a rookie and having time constraint.


# sf-muni-updates

> Real time positions of SF muni's using d3.js

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
