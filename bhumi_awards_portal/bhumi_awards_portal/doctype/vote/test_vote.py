# Copyright (c) 2021, Hussain and Contributors
# See license.txt

import frappe
import unittest

class TestVote(unittest.TestCase):
	def test_vote_increment(self):
		# Create a test college
		test_college = frappe.get_doc({
			'doctype': 'College',
			'college_name': 'test college 0',
			'location': 'test location'
		}).insert(ignore_permissions=True)

		# Default should be 0
		self.assertEqual(test_college.total_votes, 0)

		# Cast a vote
		test_vote = frappe.get_doc({
			'doctype': 'Vote',
			'college': test_college.name,
			'voter_contact': '8776554534'
		}).insert(ignore_permissions=True)

		# Reload college document
		test_college.reload()

		# Vote count should increment
		self.assertEqual(test_college.total_votes, 1)

		test_vote.delete()
		test_college.delete( )