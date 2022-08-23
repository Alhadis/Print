NPM-INSTALL = npm install --quiet --no-save --no-package-lock

all: install lint test


# Install and link development dependencies
install: node_modules

node_modules:
	$(NPM-INSTALL)


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
	@ [ "$$COVERALLS_REPO_TOKEN" ] || {\
		printf >&2 'Error: $$COVERALLS_REPO_TOKEN not set in environment; bailing\n'; \
		exit 2; \
	}
	[ -d node_modules/coveralls ] || $(NPM-INSTALL) coveralls
	npx c8 report --reporter text-lcov | npx coveralls

.PHONY: coverage
