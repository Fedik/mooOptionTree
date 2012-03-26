##info

mooOptionTree - it simple MooTools plugin that allow build the hierarchical/dynamic select list

##requires

* Mootools 1.3 or height

##usage
####HTML
````html4strict
    <div id="select-tree"></div>
````
####JavaScript

    <script type="text/javascript">
      window.addEvent('domready',function(){
        
        //some options configuration
        var options = {
          name: 'select_item', //default name for select
          choose: 'Choose...', //string with text if no option was selected
          empty_value: '', //what value to set the input if no valid option was selected
          request_url: null, //url for children request in JSON, will be POST request with query: mooOptionTree=1&id=PARENT_ID,
          loading_image: '', // link to image, show an ajax loading graphics (animated gif) while loading ajax (eg. /ajax-loader.gif)
          preselect: [], //array with ids of elements that selected. IMPORTANT: (3 != '3') ... 3 not the same as '3'
          labels: [] //array of labels for each level (ex.: ['Select one','Select two'])
        }; 
        
        //object that contain information about first <select>, in format 'id':'Title'
        //REQUIRED
        var base_select_tree = {
          '1':'Title one',
          '2':'Title two'
        };

        //object that contain information about tree of selects, in format 'parent_id':{'child_id':'child Title'}
        //it is not required if you specified "request_url" in options, that will be used for JSON request
        //also with "request_url" it can be used as pre cached info 
        var select_tree = {
          '1':{'3':'Title for 3','4':'Title for 4'},
          '2':{'5':'Title for 5','6':'Title for 6'},
          '6':{'10':'Title for 10','33':'Title for 33'}
          //and so on
        };
        
        
        
        var tree = new mooOptionTree('select-tree', options, base_select_tree, select_tree);
        //change event
        tree.addEvent('changed',function(changed){
          var id = changed.get('value');
          alert('Selected id is: ' + id);
        });
      });
    </script>

