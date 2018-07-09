/**********************************************************
 * Bind configuration data to the DOM
 * @class angular_module.kitchen_designer_app
 ***********************************************************/


import configData from './data.js';
let app = angular.module('kitchen_designer_app', []);

app.factory('app_service', () => {
  let _kitchen_designer_data = null;
  let _default_config = null;
  let max_image_height = 760;//max height of image
  let max_image_width = 1170;//max width of image
  let layers_div = document.getElementById('layers_view');
  let layers_ctx = new Array(3);
  layers_ctx[0] = document.getElementById('layer_one_view').getContext('2d');
  layers_ctx[1] = document.getElementById('layer_two_view').getContext('2d');
  layers_ctx[2] = document.getElementById('layer_three_view').getContext('2d');

  let service = {
    //Call external function from 'kitchen_designer_data.js' to configure data
    getConfigData: (_callback) => {
      configData((data, default_config) => {
        _kitchen_designer_data = data;
        _default_config = default_config;
        _callback();
      });
    },

    getKitchenLayerOne: () => {
      //Return array of names of layer 1 from data
      return _kitchen_designer_data[0].items.map((obj) => {
        return obj.name;
      });
    },

    getKitchenLayerTwo: () => {
      //Return array of names of layer 2 from data
      return _kitchen_designer_data[1].items.map((obj) => {
        return obj.name;
      });
    },

    getKitchenLayerThree: () => {
      //Return array of names of layer 3 from data
      return _kitchen_designer_data[2].items.map((obj) => {
        return obj.name;
      });
    },

    setKitchenImageLayerOne: (selectedImage) =>{
      let index = _kitchen_designer_data[0].items.findIndex(x => x.name == selectedImage);
      let img = new Image();
      img.onload = () => {
        layers_ctx[0].clearRect(0, 0, 1000, 1000);
        layers_ctx[0].drawImage(img, 0, 0, layers_div.clientWidth, layers_div.clientHeight);
      };
      //No cors access headers in images, resulting in errors due to tainted canvas
      img.src = "../images/" + _kitchen_designer_data[0].items[index].imgSrc;
    },    

    setKitchenImageLayerTwo: (selectedImage) =>{
      let index = _kitchen_designer_data[1].items.findIndex(x => x.name == selectedImage);
      let img = new Image();
      img.onload = () => {
        layers_ctx[1].clearRect(0, 0, 1000, 1000);
        layers_ctx[1].drawImage(img, 0, 0, layers_div.clientWidth, layers_div.clientHeight);
      };
      img.src = "../images/" + _kitchen_designer_data[1].items[index].imgSrc;
    },
    
    setKitchenImageLayerThree: (selectedImage) =>{
      let index = _kitchen_designer_data[2].items.findIndex(x => x.name == selectedImage);
      let ctx = document.getElementById('layer_three_view').getContext('2d');
      let img = new Image();
      img.onload = () => {
        layers_ctx[2].clearRect(0, 0, 1000, 1000);
        layers_ctx[2].drawImage(img, 0, 0, layers_div.clientWidth, layers_div.clientHeight);
      };
      img.src = "../images/" + _kitchen_designer_data[2].items[index].imgSrc;
    },

    getDefaultConfig: (layer_index) =>{
      return _default_config[layer_index];
    },

    download: (linkElement) =>{
      let canvas_layer_one = document.getElementById('layer_one_view');
      let canvas_layer_two = document.getElementById('layer_two_view');
      let canvas_layer_three = document.getElementById('layer_three_view');
      //Insert canvases into each other to render a canvas with all layers
      layers_ctx[0].drawImage(canvas_layer_two, 0 , 0);
      layers_ctx[1].drawImage(canvas_layer_three, 0 , 0);
      //Create URL from canvas for download
      let imageSrc = canvas_layer_one.toDataURL('image/jpeg');
      linkElement.download = "kitchen_designer";
      linkElement.href = imageSrc;
    }
  }
  return service;

});

app.controller('app_config', ($window, $scope, app_service) => {

  //init() is called when angular modules are loaded in the DOM
  $scope.init = () => {
    //Get and sort config data and bind options and default config to the DOM
    app_service.getConfigData(()=>{
      $scope.layer_one = app_service.getKitchenLayerOne();
      $scope.layer_one_selected = $scope.layer_one[app_service.getDefaultConfig(0)];
      $scope.layer_two = app_service.getKitchenLayerTwo();
      $scope.layer_two_selected = $scope.layer_two[app_service.getDefaultConfig(1)];
      $scope.layer_three = app_service.getKitchenLayerThree();
      $scope.layer_three_selected = $scope.layer_three[app_service.getDefaultConfig(2)];
      $scope.$apply();

      //Set images for each layer
      $scope.setImage_layer_one();
      $scope.setImage_layer_two();
      $scope.setImage_layer_three();
    });
  };

  $scope.setImage_layer_one = () => {
    app_service.setKitchenImageLayerOne($scope.layer_one_selected);
  };
  $scope.setImage_layer_two = () => {
    app_service.setKitchenImageLayerTwo($scope.layer_two_selected);
  };
  $scope.setImage_layer_three = () => {
    app_service.setKitchenImageLayerThree($scope.layer_three_selected);
  };

  $scope.downloadImage = () => {
    let element = document.getElementById('download');
    app_service.download(element);
  };

  //Call set image functions when window is resized to resize canvas layers
  let w = angular.element($window);
  w.bind('resize', () => {
    $scope.setImage_layer_one();
    $scope.setImage_layer_two();
    $scope.setImage_layer_three();
  });


});


