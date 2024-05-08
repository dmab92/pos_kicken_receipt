odoo.define('pos_kitchen_receipt_app.pos', function(require) {
	"use strict";

	var models = require('point_of_sale.models');
	var screens = require('point_of_sale.screens');
	var core = require('web.core');
	var gui = require('point_of_sale.gui');
	var popups = require('point_of_sale.popups');
	var QWeb = core.qweb;

	var _t = core._t;
	var done = {};
	var PrintKotButtonWidget = screens.ActionButtonWidget.extend({
		template: 'PrintKotButtonWidget',
		button_click: function() {
			var order = this.pos.get_order();
			var self = this;
			order.get_orderlines().forEach(function (orderline) {
				orderline.set_kot(true);
			})
			this.gui.show_screen('kot_print', {
				'category':'Kitchen'
			});
		},
	});

	screens.define_action_button({
		'name': 'KOT Print',
		'widget': PrintKotButtonWidget,
		'condition': function() {
			return true;
		},
	});

	var PrintDrinksButtonWidget = screens.ActionButtonWidget.extend({
		template: 'PrintDrinksButtonWidget',
		button_click: function() {
			var order = this.pos.get_order();
			var self = this;
			order.get_orderlines().forEach(function (orderline) {
				orderline.set_kot(true);
			})
			this.gui.show_screen('kot_print', {
				'category':'BIERRES'
			});
		},
	});

	screens.define_action_button({
		'name': 'Drinks Print',
		'widget': PrintDrinksButtonWidget,
		'condition': function() {
			return true;
		},
	});

	var PrintChichaButtonWidget = screens.ActionButtonWidget.extend({
		template: 'PrintChichaButtonWidget',
		button_click: function() {
			var order = this.pos.get_order();
			var self = this;
			order.get_orderlines().forEach(function (orderline) {
				orderline.set_kot(true);
			})
			this.gui.show_screen('kot_print', {
				'category':'CHICHA'
			});

		},
	});

	screens.define_action_button({
		'name': 'Chicha Print',
		'widget': PrintChichaButtonWidget,
		'condition': function() {
			return true;
		},
	});

	var PrintChawarmaButtonWidget = screens.ActionButtonWidget.extend({
		template: 'PrintChawarmaButtonWidget',
		button_click: function() {
			var order = this.pos.get_order();
			var self = this;
			order.get_orderlines().forEach(function (orderline) {
				orderline.set_kot(true);
			})
			this.gui.show_screen('kot_print', {
				'category':'Natural Juice'
			});
		},
	});

	screens.define_action_button({
		'name': 'Chawarma Print',
		'widget': PrintChawarmaButtonWidget,
		'condition': function() {
			return true;
		},
	});

	var PrintPizzaButtonWidget = screens.ActionButtonWidget.extend({
		template: 'PrintPizzaButtonWidget',
		button_click: function() {
			var order = this.pos.get_order();
			var self = this;
			order.get_orderlines().forEach(function (orderline) {
				orderline.set_kot(true);
			})
			this.gui.show_screen('kot_print', {
				'category':'Pizza'
			});
		},
	});

	screens.define_action_button({
		'name': 'Pizza Print',
		'widget': PrintPizzaButtonWidget,
		'condition': function() {
			return true;
		},
	});


	var _super_orderline = models.Orderline.prototype;
	models.Orderline = models.Orderline.extend({
		initialize: function() {
			_super_orderline.initialize.apply(this,arguments); 
			this.kot_print = false;
			this.done_qty = this.done_qty || 0;
			// this.table_count = {};
		},
		init_from_JSON: function(json) {
			_super_orderline.init_from_JSON.apply(this,arguments);
			this.kot_print = json.kot_print;
			this.done_qty = json.done_qty;
			
		},
		export_as_JSON: function() {
			var json = _super_orderline.export_as_JSON.apply(this,arguments);
			json.kot_print = this.kot_print;
			json.done_qty = this.done_qty;
			return json;
		},
		set_kot: function(kot_print) {
			this.kot_print = kot_print;
			this.trigger('change', this);
		},
		get_kot: function(){
			return	this.kot_print;
		},
		set_done_qty: function(done_qty){
			this.done_qty += done_qty;
			this.trigger('change', this);
		},
		get_kot: function(){
			return this.done_qty;
		},
	});

	var _super_order = models.Order.prototype;
	models.Order = models.Order.extend({
		add_product: function(product, options){
			var self = this;
			_super_order.add_product.call(this, product, options);
			if(this.pos.config.kot_print){
				this.selected_orderline.set_kot(true);
			}
		},
	});

	var PrintKotButtonScreen = screens.ScreenWidget.extend({
		template: 'PrintKotButtonScreen',
		init: function(parent,options){
			var self = this;
			this._super(parent,options);
			this.print_categ = false
		},
		
		get_coupon: function(){
			return this.gui.get_current_screen_param('options');
		},
		show: function(options){
			this._super();
			var self = this;
			this.kot_render();
		},
		kot_render_env: function() {
			var self = this
			var order = this.pos.get_order();
			var order_screen_params = order.get_screen_data('params');
			this.print_categ = order_screen_params['category']
			var count = 0 ;
			var order_table = this.pos.get_order()
			var lines = this.pos.get_order().get_orderlines();
			for(var i = 0 ; i<lines.length; i++){
				if(lines[i].kot_print){
					count = count+1
				}
			}

			var receipt_showLine = []
			
			this.pos.get_order().get_orderlines().forEach(function (orderline) {
				for (var table in done){
					if (order_table.table.id == table){
						for (var qty in done[table]){
							if (qty == orderline.product.id){
								orderline.done_qty = (done[table][qty])
							}
							
						}
					}
				}
			});


			this.pos.get_order().get_orderlines().forEach(function (orderline) {
				if (self.print_categ == 'Kitchen'){
					if(orderline.product.pos_categ_id[1] == 'Kitchen'){	
						receipt_showLine.push(orderline)
					}
				}
				else if (self.print_categ == 'BIERRES'){
					if(orderline.product.pos_categ_id[1] == 'BIERRES'){
						receipt_showLine.push(orderline)
					}	
				}
				else if (self.print_categ == 'CHICHA'){
					if(orderline.product.pos_categ_id[1] == 'CHICHA'){
						receipt_showLine.push(orderline)
					}
				}
				else if (self.print_categ == 'Natural Juice'){
					if(orderline.product.pos_categ_id[1] == 'Natural Juice'){
						receipt_showLine.push(orderline)
					}	
				}
				else if (self.print_categ == 'Pizza'){
					if(orderline.product.pos_categ_id[1] == 'Pizza'){
						receipt_showLine.push(orderline)
					}		
				}
						
			});
			if (receipt_showLine.length == 0){
				
				return false
			}


			return {
				widget: this,
				pos: this.pos,
				order: this.pos.get_order(),
				count : count,
				category : this.print_categ,
				orderlines : receipt_showLine
			};
		},
		kot_render: function(){
			if(this.kot_render_env()){
				this.$('.pos-payment-receipt-container').html(QWeb.render('KotTicket',this.kot_render_env()));
			}
			else{
				this.gui.show_screen('products');
				this.gui.show_popup('error', {
					'title': _t('Nothing To Print'),
					'body': _t('There are no orderlines'),
				});

			}
		},
		print_xml_coupon: function() {
			if(this.kot_render_env()){
				var receipt = QWeb.render('KotTicket', this.kot_render_env());
				this.pos.proxy.print_receipt(receipt);
			}
		},
		print_web_payment: function() {
			window.print();
		},
		print_coupon: function() {
			var self = this;
			if (!this.pos.config.iface_print_via_proxy) { 

				this.print_web_payment();
			} else {    
				this.print_xml_coupon();
			}
		},
		renderElement: function() {
			var self = this;
			var table_product = {};
			var table = {};
			var new_done_table = {};


			this._super();
			this.$('.next').click(function(){
				self.gui.back();
				var new_done = {};
				self.pos.get_order().get_orderlines().forEach(function (orderline) {
					if (self.print_categ == 'Kitchen'){
						if(orderline.product.pos_categ_id[1] == 'Kitchen'){
							orderline.set_kot(false);
							orderline.set_done_qty(orderline.quantity - orderline.done_qty);
							new_done[orderline.product.id] = orderline.done_qty;
						}
					}
					else if (self.print_categ == 'BIERRES'){
						if(orderline.product.pos_categ_id[1] == 'BIERRES'){	
							orderline.set_kot(false);
							orderline.set_done_qty(orderline.quantity - orderline.done_qty);
							new_done[orderline.product.id] = orderline.done_qty;
						}	
					}
					else if (self.print_categ == 'CHICHA'){
						if(orderline.product.pos_categ_id[1] == 'CHICHA'){	
							orderline.set_kot(false);
							orderline.set_done_qty(orderline.quantity - orderline.done_qty);
							new_done[orderline.product.id] = orderline.done_qty;
						}	
					}
					else if (self.print_categ == 'Natural Juice'){
						if(orderline.product.pos_categ_id[1] == 'Natural Juice'){	
							orderline.set_kot(false);
							orderline.set_done_qty(orderline.quantity - orderline.done_qty);
							new_done[orderline.product.id] = orderline.done_qty;
						}	
					}
					else if (self.print_categ == 'Pizza'){
						if(orderline.product.pos_categ_id[1] == 'Pizza'){	
							orderline.set_kot(false);
							orderline.set_done_qty(orderline.quantity - orderline.done_qty);
							new_done[orderline.product.id] = orderline.done_qty;
						}	
					}
								
				});
				if (self.pos.get_order().table != undefined){
					new_done_table[self.pos.get_order().table.id] = new_done;
					done = new_done_table;
				}
			});
			
			this.$('.back').click(function(){
				self.gui.back();
			});
			this.$('.button.print-coupon').click(function(){
				self.print_coupon();
			});
		},

	});
	gui.define_screen({name:'kot_print', widget: PrintKotButtonScreen});

});