# Copyright (c) 2021, Hussain and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Vote(Document):
	def validate(self):
		self.set_voter()
		self.validate_single_vote()
		self.validate_mobile_no()

	def validate_single_vote(self):
		'''A voter can only vote once'''
		all_voters = set(frappe.get_all('Vote', pluck='voter'))
		if self.voter in all_voters:
			frappe.throw('You have already voted!')

	def validate_mobile_no(self):
		if self.voter_contact and len(self.voter_contact) != 10:
			frappe.throw('Contact Number should have exactly 10 digits.', title='Invalid Contact No.')

		if self.management_contact and len(self.management_contact) != 10:
			frappe.throw('Contact Number should have exactly 10 digits.', title='Invalid Contact No.')

	def before_save(self):
		self.set_voter_name()

	def set_voter(self):
		if not self.voter:
			self.voter = frappe.session.user

	def set_voter_name(self):
		voter = frappe.get_doc('User', self.voter)
		self.voter_name = voter.full_name

	def after_insert(self):
		# Increase the vote count for this particular college
		self.increment_vote_count()

	def increment_vote_count(self):
		college = frappe.get_doc('College', self.college)
		college.total_votes = college.total_votes + 1
		college.save()

	def on_trash(self):
		self.decrement_vote_count()

	def decrement_vote_count(self):
		college = frappe.get_doc('College', self.college)
		college.total_votes = college.total_votes - 1
		college.save()