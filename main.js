 // Katie Litchen 02Mar2026
 // relocated script to separate js file

 //Elijah Gardner Woods 08Mar2026
 //Added title at the top, info side bubble, added more spacing between code chunks, fixed typos.
 
 // esri.js modules needed: 
 require([
    // for api key:
    "esri/config",
    // for map elements, custom basemap
    "esri/Map", "esri/views/MapView", "esri/Basemap","esri/layers/VectorTileLayer",
    // for all widgets used
    "esri/widgets/BasemapGallery","esri/widgets/Expand","esri/widgets/Locate","esri/widgets/Search","esri/widgets/Editor","esri/widgets/Legend",
    // for feature layers (no graphics, actually)
    "esri/layers/FeatureLayer", 
    // all modules added to fx - 
], function(esriConfig, Map, MapView, Basemap, VectorTileLayer, BasemapGallery, Expand, Locate, Search, Editor, Legend, FeatureLayer) {   
        
    // esri api key:
    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurBvZ7IXFuSOhRBuDgv645DOBpnCJ2vtGJsSqd0m31lu7G8oTSCniq7WBlH5N3K2i5Kk1zQ90Yxo4NRi0pv9a9tVhNCaTXh4UYBVSuMTZ4n-VHPYlh3hbIHglPgtC4dS9xt9DvdwtH300t76D_qaoPY1hHx-ZWazuU7A71NQteoVL5YMZ3d0qyiM8FhAB_8wsn9Lfxg-Z0qlqMFoRqQ2XStDdlWe0dU69PsLBWTeob7thAT1_t2Pq0hM2"
        


//**Basic Map Elements: 
    // tile layer to hold custom basemap: 
    const basemapLayer = new VectorTileLayer({
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

    // page title:
    const pageTitle = document.createElement("div");
    pageTitle.innerText = "Wisconsin Parks Atlas"; // Change title here
    pageTitle.style.position = "absolute";
    pageTitle.style.top = "0";
    pageTitle.style.left = "0";
    pageTitle.style.width = "93%"; // spacing of the top bar. Set to 93% to make sure the map layers panel isn't covered.
    pageTitle.style.padding = "16px";
    pageTitle.style.background = "rgba(0,0,0,0.75)";
    pageTitle.style.color = "white";
    pageTitle.style.fontSize = "22px";
    pageTitle.style.fontWeight = "bold";
    pageTitle.style.textAlign = "center";
    pageTitle.style.zIndex = "99";

    document.body.appendChild(pageTitle);

    // responsive title width
    function updateTitleForScreenSize() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            pageTitle.style.position = "absolute";
            pageTitle.style.width = "75%";
        } else {
            pageTitle.style.width = "93%";
        }
    }

    updateTitleForScreenSize();
    window.addEventListener("resize", updateTitleForScreenSize);

    // info bubble:
    const infoBubble = document.createElement("div");
    infoBubble.innerHTML = `
    <div id="infoBubbleHeader"><b>Information</b></div>
    <div id="infoBubbleContent"><em>The many parks in the Madison, WI, area!</em><br><br>
    Mark which parks you’ve visited, rate them, and write reviews!  If you know of or encounter something wrong with or in the park, you can report it. <br><br> 
    Press the <b>pen</b> icon on the left to open the <b>Editor</b>, which lets you Select a park and review it, or mark an Incident.  Use the red <b>Incident</b> button at the bottom of the Editor to mark an incident. <br><br> 
    The two buttons above the Editor button show you the map Legend and the map style choices.  The circle with crosshairs is the Find My Location button.<br><br>
    <em>Enjoy!</em></div>
    `;
    infoBubble.style.position = "absolute";
    infoBubble.style.left = "15px";
    infoBubble.style.top = "65px";
    infoBubble.style.width = "67px";
    infoBubble.style.padding = "15px";
    infoBubble.style.background = "white";
    infoBubble.style.borderRadius = "10px";
    infoBubble.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
    infoBubble.style.fontFamily = "Arial, sans-serif";
    infoBubble.style.zIndex = "99";
    infoBubble.style.overflow = "hidden";

    document.body.appendChild(infoBubble);

    const infoBubbleHeader = document.getElementById("infoBubbleHeader");
    const infoBubbleContent = document.getElementById("infoBubbleContent");

    infoBubbleHeader.style.padding = "7px";
    infoBubbleHeader.style.fontWeight = "bold";
    infoBubbleHeader.style.background = "#f5f5f5";
    infoBubbleHeader.style.borderRadius = "5px";
    infoBubbleHeader.style.cursor = "default";

    infoBubbleContent.style.paddingTop = "0";

    // info bubble mobile behavior.
    function updateInfoBubbleForScreenSize() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            infoBubble.style.width = "67px";
            infoBubble.style.top = "65px";
            infoBubble.style.left = "10px";
            infoBubble.style.padding = "5px";
            infoBubbleHeader.style.cursor = "pointer";
            infoBubbleHeader.style.borderRadius = "5px";
            infoBubbleHeader.innerText = "▼ Info";

            // Start collapsed on mobile unless explicitly opened
            if (!infoBubble.dataset.expanded) {
            infoBubble.dataset.expanded = "false";
            infoBubbleContent.style.display = "none";
            }
        } else {
            infoBubble.style.width = "260px";
            infoBubble.style.top = "65px";
            infoBubble.style.left = "15px";
            infoBubbleHeader.style.cursor = "default";
            infoBubbleHeader.innerText = "Information";
            infoBubbleContent.style.display = "block";
            infoBubble.dataset.expanded = "true";
        }
    }

    infoBubbleHeader.addEventListener("click", function () {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) return;

        const expanded = infoBubble.dataset.expanded === "true";

        if (expanded) {
            infoBubble.style.width = "80px";
            infoBubbleContent.style.display = "none";
            infoBubbleHeader.innerText = "▼ Info";
            infoBubble.dataset.expanded = "false";
        } else {
            infoBubble.style.width = "280px";
            infoBubbleContent.style.display = "block";
            infoBubbleHeader.innerText = "▲ Information";
            infoBubble.dataset.expanded = "true";
        }
    });

    updateInfoBubbleForScreenSize();
    window.addEventListener("resize", updateInfoBubbleForScreenSize);

        
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
    


//**Widgets and Customization:
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
    view.ui.add(search, "bottom-right"); // set search bar location

    // locate widget: 
    const locate = new Locate({
    view: view
    });
    view.ui.add(locate, "bottom-right") // set locate button location



//**Incident Survey Feature Layer:
    // pop-up for survey results -> contains link to edit the details:
    const popup_Survey = {
    "title": "Incident Details:",
    "content": "<b>Date and Time:</b> {note_the_date_and_time_of_the_i}<br> <b>Description:</b> {incident_details} <br> <a href=https://survey123.arcgis.com/share/39d43140fb4a474fb9292e828b60c619?mode=edit&globalId={globalid}&version=latest><b>Edit Response</b></a>"
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
        title: "Incident Report", // wanted this to show up instead of the survey 123 text in the editor but idk
        renderer: surveyRenderer
    }); map.add(surveyLayer); // add feature layer to map



//**Parks Feature Layer Elements:
    // popup content:
    const popup_wiParks = {
    "title": "Park Information:",
    "content": "<b>Name:</b> {NAME}<br> <b>Category:</b> {FEATTYPE} <br> <b>Area:</b> {SQMI} square miles <br><b>Visited:</b> {VISTITED}<br> <b>Rating:</b> {RATING}<br> <b>Review:</b> {REVIEW}<br>"
    }; // wanted to also make this editable from the pop-up but idk
    
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
            color: "#a1d99b"
        }
        },{
        value: "Local park",
        symbol: {
            type: "simple-fill",
            color: "#c7e9c0",
        }
        }]
      };

    // feature layer for WI parks:
    const wiParksLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/576_WI_Parks/FeatureServer",
    popupTemplate: popup_wiParks, 
    // labelingInfo: [parkName], // un-comment to add back the park name labels if desired
    renderer: parkRenderer,
    opacity: 0.6 // so default basemap labels for parks show through (in lieu of custom labels)
    }); map.add(wiParksLayer); // add feature layer to map



//**Legend Elements:
    // legend constructor:
    const myLegend = new Legend ({
      view: view,
      layerInfos: [{layer: wiParksLayer},{layer: surveyLayer}],
    });
    // put legend in expandable widget:
    const legendExpand = new Expand ({
      view: view,
      content: myLegend
    })
    view.ui.add(legendExpand, "top-right"); // put legend in expandable tab



//**Editor Elements:
    // editor constructor:
    const editor = new Editor({
      view: view,
      layerInfos: [{layer: wiParksLayer},{layer: surveyLayer}],
    });

    // expand widget for editor:
    const editorExpand = new Expand({ //put editor in an expandable tab
        view: view,
        content: editor
    });
    view.ui.add(editorExpand, "top-right"); //set expandable tab location

    // error handling for the surveyLayer and wiParkslayer.
    // surveyLayer.when().catch(console.error);
    // wiParksLayer.when().catch(console.error);

});