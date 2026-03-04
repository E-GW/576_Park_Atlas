 // Katie Litchen 02Mar2026
 // relocated script to separate js file
 
 // esri.js modules needed: 
 require([
    // for api key:
    "esri/config",
    // for map elements, custom basemap
    "esri/Map", "esri/views/MapView", "esri/Basemap","esri/layers/VectorTileLayer",
    // for all widgets used
    "esri/widgets/BasemapGallery","esri/widgets/Expand","esri/widgets/Locate","esri/widgets/Search",
    "esri/widgets/Editor","esri/widgets/Legend",
    // for graphics and feature layers
    "esri/Graphic",  "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer"
    // all modules added to fx - 
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
    center: [-89.384, 43.075], 
    zoom: 10,                 
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
    view.ui.add(expand, "top-right"); //set expandable tab location

    // search widget:
    const search = new Search({
    view: view
    });
    view.ui.add(search, "bottom-left"); // set search bar location

    // locate widget: 
    const locate = new Locate({
    view: view
    });
    view.ui.add(locate, "bottom-left") // set locate button location

//Incident Survey Feature Layer:
    const popup_Survey = {
    "title": "Incident Details:",
    "content": "<b>Date and Time:</b> {note_the_date_and_time_of_the_i}<br> <b>Description:</b> {incident_details} <br> <b>Edit Incident:</b> <a href=https://survey123.arcgis.com/share/39d43140fb4a474fb9292e828b60c619?mode=edit&globalId={globalid}&version=latest>Edit Response</a>"
    };    

    const simpleMarkerSymbol = {  
    type: "simple-marker",
    style: "circle",
    size: "8px",  
    outline: {  
      color: [204, 85, 0], // burnt orange  
      width: 2
      }  
    };

    const surveyRenderer = {
    type: "simple",
    symbol: {
        type: "picture-marker",
        url: "https://kmlitchen.github.io/576_Park_Atlas/exclamation.png", 
        width: "14px",
        height: "14px"
        }
    }

    const surveyLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/survey123_39d43140fb4a474fb9292e828b60c619_results/FeatureServer",
        popupTemplate: popup_Survey,
        tite: "Incident Report",
        renderer: surveyRenderer
    });
    
    map.add(surveyLayer);


// Parks Feature Layer Elements:
    // popup content:
    const popup_wiParks = {
    "title": "Park Information:",
    "content": "<b>Name:</b> {NAME}<br> <b>Category:</b> {FEATTYPE} <br> <b>Area:</b> {SQMI} square miles"
    };
    // 
    const parkName = {
      symbol: {
        type: "text",
        font: {
          size: "9px",
          family: "Noto Sans",
          style: "italic",
          weight: "normal"
        }
      },
      labelExpressionInfo: {
        expression: "$feature.Name"
      }
    };
    // parks feature layer:
    const wiParksLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/576_WI_Parks/FeatureServer",
    popupTemplate: popup_wiParks, // pull pop-up
    //labelingInfo: [parkName]
    });
    map.add(wiParksLayer); // add feature layer to map

    // Set the point layer's LayerInfo
    const pointInfos = {
      layer: ({wiParksLayer, surveyLayer})
    }

// Editor Elements:
    // editor constructor
    const editor = new Editor({
      view: view,
      layerInfos: [pointInfos],
    });

    const editorExpand = new Expand({ //put editor in an expandable tab
        view: view,
        content: editor
    });
    view.ui.add(editorExpand, "top-right"); //set expandable tab location

});