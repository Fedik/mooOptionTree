/*
 * MooTools mooOptionTree plugin
 * version: 0.1 / 2012.03.23
 *
 * @requires:
 * 		Mootools 1.3 and height
 *
 * GPL licenses:
 *    http://www.gnu.org/licenses/gpl.html
 *
 * @author  Fedir Zinchuk <getthesite at gmail dot com>
 * @site http://getsite.org.ua
 */

/**
 * Converts passed JSON option tree into dynamically created <select> elements allowing you to
 * choose nested options.
 *
 * @param element string/object to append <select>
 * @param object options additional options
 * @param object root elements of a tree : {'id':'Title'}
 * @param object tree elements: {'parent_id':{'id3':'Title3','id4':'Title4'},'parent_id2':{'id2':'Title2'}}
 */
var mooOptionTree = new Class({

	//implements
	Implements: [Options,Events],

    //options
	options: {
		name: 'select_item', //default name for select
		choose: 'Choose...', // string with text if no option was selected
		empty_value: '', // what value to set the input to if no valid option was selected
		request_url: null, //url for children request in JSON, will be a POST request with query: mooOptionTree=1&id=PARENT_ID,
		loading_image: '', // link to image, show an ajax loading graphics (animated gif) while loading ajax (eg. /ajax-loader.gif)
		preselect: [], //array with ids of elements that selected. IMPORTANT: (3 != '3') ... 3 not the same as '3'
		labels: [] //array of labels for each level
	},

	initialize: function(element, options, treeRoot, tree){
		//set options
		this.setOptions(options);
		//set base element
		this.element = document.id(element);

		//set root elements of tree
		this.treeRoot = treeRoot;
		//set tree
		this.tree = tree ? tree : {};

	    //make image element for loading animation
	    this.loading_image = null;
		if(this.options.loading_image){
			this.loading_image = new Element('img', {
				src: this.options.loading_image,
				alt: 'Loading...',
				'class': 'loading-animation'
			});
		}

	    //do it!
		this.updateTree();
   	},

  	/**
	 * id - id of parrent
	 * after - previous select or nothing
	 */
	addSelect: function(id){
		var name = this.options.name;
		var changed = false;

		if(!id){//build root
			var tree = this.treeRoot;
		} else if(this.tree && this.tree[id]){ //build children
			var tree = this.tree[id];
			name += '_' + id;
		} else { //item have no children
			return;
		}

		var select = new Element('select',{	name: name});
		//appaned to DOM
		select.inject(this.element, 'bottom');

		select.addEvent('change', function(e){
			this.updateTree(e.target);
		}.bind(this));

		//add label if given
		if(this.options.labels.length){
			//find curent level via count previous elements
			var lvl = select.getAllPrevious('select').length;
			//label text
			var lbl_text = this.options.labels[lvl];
			if (lbl_text){
				var label = new Element('label',{
					'for': name,
					html: lbl_text
				});
				label.inject(select,'before');
			}
		}


		//add options

		//empty item
		var option = new Element('option',{
		    	value: this.options.empty_value,
		    	html: this.options.choose
		    });
		option.inject(select);
		//from tree
		Object.each(tree, function(title, id){
		    var option = new Element('option',{
		    	value: id,
		    	html: title
		    });
		    option.inject(select);
		    //preselect
		    if(this.options.preselect && this.options.preselect.indexOf(id) != -1){
				select.set('value', id);
				select.fireEvent('change', {target: select});
		    }

		}.bind(this));

	},

	/**
	 *  changed - DOM element of chenged select
	 */
	updateTree: function (changed){
		//var id;//id of selected children
		if(changed){

			//clear all after changed
			changed.getAllNext('label').destroy().empty()
			changed.getAllNext('select').destroy().empty();

			//add children select
			var id = changed.get('value');
			//get children JSON if link is given and tree empty
			if (this.options.request_url && id != this.options.empty_value && !this.tree[id]){
				this.requestChildren(changed);
			} else {//add select
				this.addSelect(id);
			}
		} else {
			//cleare and build new
			this.element.getChildren('label').destroy().empty()
			this.element.getChildren('select').destroy().empty();
			//build new
			this.addSelect()
		}
		//change event
		this.fireEvent('changed', [changed]);
	},

	/**
	 * for rebuild tree
	 */
	resetTree: function(full){
		if(full){
			this.options.preselect = null;
		}
		this.updateTree();
	},

	/**
	 * do ajax request for get children for givent id
	 */
	requestChildren: function (changed) {
		var id = changed.get('value');
		var loading_image = this.loading_image;

		this.request = new Request.JSON({
		    url: this.options.request_url,
		    method: 'post',
		    data: 'mooOptionTree=1&id='+id,
		    onRequest: function(){
		        //show loadin animation
		        if(loading_image){
		        	loading_image.inject(changed, 'after');
		        }
		    },
		    onFailure: function(xhr){
		        console.error(xhr);
		    }
		}).send();

		this.request.addEvent('success', function(response){
			if(response.length){
				//save answer
		    	this.tree[id] = response;
		    }
		    //hide loadin animation
		    if(loading_image){
		       	loading_image.dispose();
		    }
		    this.addSelect(id);
		}.bind(this));
	}

});
