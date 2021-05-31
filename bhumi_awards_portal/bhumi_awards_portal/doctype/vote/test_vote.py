# Copyright (c) 2021, Hussain and Contributors
# See license.txt

import frappe
import unittest

class TestVote(unittest.TestCase):
	def setUp(self):
		# Create a test college
		self.test_college = frappe.get_doc({
			'doctype': 'College',
			'college_name': 'test college for vote',
			'location': 'test location'
		}).insert(ignore_permissions=True)
	
	def tearDown(self):
		self.test_college.delete()
	
	def test_vote_increment(self):
		# Default should be 0
		self.assertEqual(self.test_college.total_votes, 0)

		# Cast a vote
		test_vote = self.create_vote(self.test_college.name)

		# Reload college document
		self.test_college.reload()

		# Vote count should increment
		self.assertEqual(self.test_college.total_votes, 1)

		# Delete the vote
		test_vote.delete()
	
	def create_vote(self, college_name):
		test_vote = frappe.get_doc({
			'doctype': 'Vote',
			'college': college_name,
			'voter_contact': '8776554534',
			'voter': 'Administrator'
		}).insert(ignore_permissions=True)

		return test_vote

	def test_vote_decrement(self):
		test_vote = self.create_vote(self.test_college.name)
		
		# Should be 1 after a single vote
		self.test_college.reload()
		self.assertEqual(self.test_college.total_votes, 1)
		
		# Should be 0 after vote deletion
		test_vote.delete()
		self.test_college.reload()
		self.assertEqual(self.test_college.total_votes, 0)