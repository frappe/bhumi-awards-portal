# Copyright (c) 2023, Hussain and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document

class PreviousWinners(Document):
	def after_insert(self):
		self.for_id = "id"+self.name
