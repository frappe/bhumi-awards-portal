# Copyright (c) 2021, Hussain and Contributors
# See license.txt

import frappe
import unittest

class TestVote(unittest.TestCase):
	def setUp(self):
		# Create a test college
		self.test_college = frappe.get_doc({
			'doctype': 'College',
			'college_name': 'test college 1',
			'location': 'test location'
		}).insert(ignore_permissions=True)
	
	def tearDown(self):
		self.test_college.delete()
	
	def test_vote_increment(self):
		# Default should be 0
		self.assertEqual(self.test_college.total_votes, 0)

		# Cast a vote
		test_vote = frappe.get_doc({
			'doctype': 'Vote',
			'college': self.test_college.name,
			'voter_contact': '8776554534',
			'voter': 'Administrator'
		}).insert(ignore_permissions=True)

		# Reload college document
		self.test_college.reload()

		# Vote count should increment
		self.assertEqual(self.test_college.total_votes, 1)

		# Delete the vote
		test_vote.delete()
		