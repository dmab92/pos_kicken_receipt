# -*- coding: utf-8 -*-

from itertools import groupby
from datetime import datetime, timedelta

from odoo import api, fields, models, _
from odoo.exceptions import UserError, ValidationError
from odoo.tools import float_is_zero, float_compare, DEFAULT_SERVER_DATETIME_FORMAT
from odoo.tools.misc import formatLang
from odoo.tools import html2plaintext
import odoo.addons.decimal_precision as dp

class PosConfigInherit(models.Model):
	_inherit = "pos.config"

	kot_print = fields.Boolean(string = "Print Kitchen Receipt")
	drinks_print = fields.Boolean(string = "Print Drinks Receipt")
	pizza_print = fields.Boolean(string = "Print Pizza Receipt")
	chicha_print = fields.Boolean(string = "Print Chicha Receipt")
	chawarma_print = fields.Boolean(string = "Print Chawarma Receipt")
	

class PosOrderInherit(models.Model):
	_inherit = "pos.order.line"	

	done_qty = fields.Integer(string="Done Qty")