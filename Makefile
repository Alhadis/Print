all: install lint test


# Install and link development dependencies
install: node_modules

node_modules:
	npm install --quiet --no-save --no-package-lock


# Check source for errors and style violations
lint: install
	npx eslint .

.PHONY: lint


# Run unit-tests
test: install
	npx c8 mocha

.PHONY: test


# Submit coverage information to Coveralls.io
coverage:
	npm install coveralls
	npx c8 report --reporter text-lcov | npx coveralls

.PHONY: coverage
