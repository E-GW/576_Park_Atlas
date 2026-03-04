 // Katie Litchen 02Mar2026
 // relocated script to separate js file
 
 // esri.js modules needed: 
 require([
    // for api key:
    "esri/config",
    // for map elements, custom basemap
    "esri/Map", "esri/views/MapView", "esri/Basemap","esri/layers/VectorTileLayer",
    // for all widgets used
    "esri/widgets/BasemapGallery","esri/widgets/Expand","esri/widgets/Locate","esri/widgets/Search","esri/widgets/Editor","esri/widgets/Legend",
    // for graphics and feature layers (no graphics, actually)
    "esri/Graphic",  "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer", 
    // all modules added to fx - 
], function(esriConfig, Map, MapView, Basemap, vectorTileLayer, BasemapGallery, Expand, Locate, Search, Editor, Legend, Graphic, GraphicsLayer, FeatureLayer, LabelClass) {   
        
    // esri api key:
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
    // pop-up for survey results -> contains link to edit the details:
    const popup_Survey = {
    "title": "Incident Details:",
    "content": "<b>Date and Time:</b> {note_the_date_and_time_of_the_i}<br> <b>Description:</b> {incident_details} <br> <b>Edit Incident:</b> <a href=https://survey123.arcgis.com/share/39d43140fb4a474fb9292e828b60c619?mode=edit&globalId={globalid}&version=latest>Edit Response</a>"
    };    
    
    // renderer for incident style icon: 
    const surveyRenderer = {
    type: "simple",
    symbol: {
        type: "picture-marker",
        url: "https://kmlitchen.github.io/576_Park_Atlas/data/exclamation.png", 
        width: "14px",
        height: "14px"
        }
    }

    // feature layer for survey results:
    const surveyLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/survey123_39d43140fb4a474fb9292e828b60c619_results/FeatureServer",
        popupTemplate: popup_Survey,
        tite: "Incident Report", // wanted this to show up instead of the survey 123 text in the editor but idk
        renderer: surveyRenderer
    }); map.add(surveyLayer); // add feature layer to map


// Parks Feature Layer Elements:
    // popup content:
    const popup_wiParks = {
    "title": "Park Information:",
    "content": "<b>Name:</b> {NAME}<br> <b>Category:</b> {FEATTYPE} <br> <b>Area:</b> {SQMI} square miles <br><b>Visited:</b> {VISTITED}<br> <b>Rating:</b> {RATING}<br> <b>Review:</b> {REVIEW}<br>"
    };
    
    // park name labels -> not used, too much overprinting!
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

    // renderer for park polygons -> set color by type
    const parkRenderer = {
      type: "unique-value",
      field: "FEATTYPE",
      defaultSymbol: { type: "simple-fill" },
      //valueExpression: When(IsEmpty($feature.VISITED), 'Null', $feature.VISITED),
      uniqueValueInfos: [{
        value: "National park or forest",
        symbol: {
            type: "simple-fill",
            color: "#006d2c"
        }
        },{
        value: "State park or forest",
        symbol: {
            type: "simple-fill",
            color: "#31a354"
        }
        },{
        value: "County park",
        symbol: {
            type: "simple-fill",
            color: "#74c476"
        }
        },{
        value: "Regional park",
        symbol: {
            type: "simple-fill",
            color: "#bae4b3"
        }
        },{
        value: "Local park",
        symbol: {
            type: "simple-fill",
            color: "#edf8e9",
            opacity: "50%"
        }
        }]
      };

    // feature layer for WI parks:
    const wiParksLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/576_WI_Parks/FeatureServer",
    popupTemplate: popup_wiParks, 
    //abelingInfo: [parkName], // un-comment to add back the park name labels if desired
    renderer: parkRenderer,
    opacity: 0.6 // so basemap labels for parks show through
    }); map.add(wiParksLayer); // add feature layer to map

// Legend Elements:

    const myLegend = new Legend ({
      view: view,
      layerInfos: [{layer: wiParksLayer},{layer: surveyLayer}],
    });
    const legendExpand = new Expand ({
      view: view,
      content: myLegend
    })
    view.ui.add(legendExpand, "top-right"); // put legend in expandable tab


// Editor Elements:
    // feature layers to feed into the editor:
    const pointInfos = {
      layer: ({wiParksLayer, surveyLayer})
    }

    // editor constructor:
    const editor = new Editor({
      view: view,
      layerInfos: [pointInfos],
    });

    // expand widget for editor:
    const editorExpand = new Expand({ //put editor in an expandable tab
        view: view,
        content: editor
    });
    view.ui.add(editorExpand, "top-right"); //set expandable tab location

});