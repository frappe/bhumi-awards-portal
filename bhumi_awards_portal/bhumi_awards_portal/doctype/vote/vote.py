# Copyright (c) 2021, Hussain and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Vote(Document):
	def after_insert(self):
		# Increase the vote count for this particular college
		self.increment_vote_count()

	def increment_vote_count(self):
		college = frappe.get_doc('College', self.college)
		college.total_votes = college.total_votes + 1
		college.save()