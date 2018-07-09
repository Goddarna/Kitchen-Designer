

/*****************************************************************
 * Fetch configuration data and sort data
 * @function getConfigData
 *****************************************************************/

export default function getConfigData(_callback){
  loadJSON('https://lab.pikcells.com/code-exercise/data.json', (data) => {
      sortData(data, (sortedData, defaultConfig) => {
        _callback(sortedData, defaultConfig);
    });
  });
}

//Request JSON file from server
function loadJSON(file, _callback){
  let req = new XMLHttpRequest();
  req.open('GET', file, true);
  req.responseType = 'text';
  req.onload = () => {
    let json_data = JSON.parse(req.response);
    _callback(json_data);
  }
  req.send(null);
}

//Sort data to sorted array
function sortData(data, _callback){
  let layer_images = new Array(3);
  layer_images[0] = ['U1Y.jpg', 'Ogf.jpg', '9VR.jpg', 'jB1.jpg', 'aDn.jpg', 'hk9.jpg', 'BWK.jpg'];
  layer_images[1] = ['uAS.png', 'EWU.png', '8jD.png', '081.png', '58Z.png', 'VRC.png', 'jeb.png'];
  layer_images[2] = ['8ls.png', '2UN.png', '020.png', 'Wx4.png', 'L99.png', '2Ks.png', '0Og.png'];

  let sorted_data = new Array(3);
  let default_config_data = new Array(3);

  for (let i = 0; i < 3; i++){
    let layer = 0;

    //If layer items within the data match the items within the layer arrays, define layer index
    if(layer_images[0].includes(data.layers[i].items[0].imgSrc)){
      layer = 0;
    } else if (layer_images[1].includes(data.layers[i].items[0].imgSrc)){
      layer = 2;
    } else if (layer_images[2].includes(data.layers[i].items[0].imgSrc)){
      layer = 1;
    }

    //Sort data based on layer indexes
    sorted_data[layer] = data.layers[i];

    //Sort items into ascending numberical order based on order property
    sorted_data[layer].items.sort((a, b) =>{
      return a.order-b.order;
    });

    //Sort default config based on layer indexes
    default_config_data[layer] = data.default_configuration[i];
  }

  _callback(sorted_data, default_config_data);
}

