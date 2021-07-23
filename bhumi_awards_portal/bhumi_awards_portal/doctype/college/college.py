# Copyright (c) 2021, Hussain and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class College(Document):
	def validate(self):
		self.set_registered_by()
		if not self.created_via_web_form:
			self.approval_status = 'Approved'

	def set_registered_by(self):
		if not self.registered_by:
			self.registered_by = frappe.session.user
			self.registered_by_name = frappe.db.get_value('User', self.registered_by, 'full_name')

	@staticmethod
	def get_with_rank(limit=None, name_query=None):
		colleges = frappe.get_all(
			'College',
			filters={'approval_status': 'Approved'},
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

	@staticmethod
	def get_paginated(limit_start=0, limit_page_length=30, order_by=None, location_query=None, name_query=None):
		if order_by is None:
			order_by = 'total_votes desc'

		filters = {'approval_status': 'Approved'}

		if name_query:
			filters['name'] = ('like', f'%{name_query}%')

		if location_query:
			filters['location'] = ('like', f'%{location_query}%')

		colleges = frappe.get_all(
			'College',
			fields=['name', 'total_votes', 'location'],
			filters=filters,
			order_by=order_by,
			limit_start=limit_start,
			limit_page_length=limit_page_length
		)

		return colleges
