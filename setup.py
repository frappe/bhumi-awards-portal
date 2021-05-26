from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in bhumi_awards_portal/__init__.py
from bhumi_awards_portal import __version__ as version

setup(
	name='bhumi_awards_portal',
	version=version,
	description='Portal Website for Bhumi NGO.',
	author='Hussain',
	author_email='t4c@bhumi.ngo',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
