 // Katie Litchen 02Mar2026
 // relocated script to separate js file
 
 // esri.js modules needed: 
 require([
    // for api key:
    "esri/config",
    // for map elements, custom basemap
    "esri/Map",
    "esri/views/MapView",
    "esri/Basemap",
    "esri/layers/VectorTileLayer",
    // for all widgets used
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/Locate",
    "esri/widgets/Search",
    "esri/widgets/Editor",
    "esri/widgets/Legend",
    // new modules for graphics and feature layers
    "esri/Graphic",  
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer"
    // add all modules to fx - 
], function(esriConfig, Map, MapView, Basemap, vectorTileLayer, BasemapGallery, Expand, Locate, Search, Editor, Legend, Graphic, GraphicsLayer, FeatureLayer) {   
        
    // esri api key
    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurBvZ7IXFuSOhRBuDgv645DOBpnCJ2vtGJsSqd0m31lu7G8oTSCniq7WBlH5N3K2i5Kk1zQ90Yxo4NRi0pv9a9tVhNCaTXh4UYBVSuMTZ4n-VHPYlh3hbIHglPgtC4dS9xt9DvdwtH300t76D_qaoPY1hHx-ZWazuU7A71NQteoVL5YMZ3d0qyiM8FhAB_8wsn9Lfxg-Z0qlqMFoRqQ2XStDdlWe0dU69PsLBWTeob7thAT1_t2Pq0hM2"
        
//**Basic Map Elements: 
    // tile layer to hold custom basemap: 
    const basemapLayer = new vectorTileLayer({
    portalItem: { 
        id: "659e7c1b1e374f6c8a89eefe17b23380" // "outdoor" tile layer from the living atlas
        }
    });

    // map element: 
    const map = new Map({
    basemap: new Basemap({
        baseLayers: [basemapLayer], // set to custom layer
        })
    });
        
    // map view + properties:
    const view = new MapView({  
    map: map,
    center: [-89.8173, 44.6536], 
    zoom: 6,                 
    container: "Map", // div element
    constraints: {
        minScale: 100,
        maxScale: 5000000, // limiting max scale (instead of map extent) to keep focus around WI
    },
    });                         
    
// Widgets and Customization:
    // move +/- zoom buttons:
    view.ui.move("zoom", "bottom-right");
    
    // basemap gallery widget:
    const basemapGallery = new BasemapGallery({
    view: view,
    });
    
    const expand = new Expand({ // put basemap gallery widget in an expandable tab 
        view: view,
        content: basemapGallery 
    });
    view.ui.add(expand, "bottom-left"); //set expandable tab in bottom-left of map

    // search widget:
    const search = new Search({
    view: view
    });
    view.ui.add(search, "bottom-left"); // set location

    // locate widget: 
    const locate = new Locate({
    view: view
    });
    view.ui.add(locate, "bottom-left") // set location

// Parks Feature Layer Elements:
    const popup_wiParks = {
    "title": "Park Information:",
    "content": "<b>Name:</b> {NAME}<br> <b>Category:</b> {FEATTYPE} <br> <b>Area:</b> {SQMI} square miles"
    };
    //adding the Const for the feature layer
    const wiParksLayer = new FeatureLayer({
    url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Detailed_Parks/FeatureServer/",
    //adding the popup here
    popupTemplate: popup_wiParks
    });
    //adding the feature layer to the map
    map.add(wiParksLayer);

});