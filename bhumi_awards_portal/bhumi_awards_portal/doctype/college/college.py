# Copyright (c) 2021, Hussain and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class College(Document):
	@staticmethod
	def get_colleges_by_rank(limit=None, name_query=None):
		colleges = frappe.get_all(
			'College', 
			fields=['name', 'total_votes', 'location'],
			order_by='total_votes desc'
		)

		for index, college in enumerate(colleges):
			rank = index + 1
			college.rank = rank
		
		# Filter based on college name
		if name_query:
			colleges = list(filter(lambda x: x.name.lower().startswith(name_query), colleges))

		# Limit the number of results
		if limit:
			limit = int(limit)
			colleges = colleges[:limit]

		return colleges


