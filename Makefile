all: install lint test


# Install and link development dependencies
install: node_modules

NPM      = npm install --quiet --no-save --no-package-lock
OLD_NODE = case "`node -v`" in v[68].*) true ;; *) false ;; esac

node_modules:
	if $(OLD_NODE); \
	then $(NPM) mocha@5.2.0 chai@4.2.0; \
	else $(NPM); \
	fi


# Check source for errors and style violations
lint: install
	$(OLD_NODE) || npx eslint .

.PHONY: lint


# Run unit-tests
test: install
	if $(OLD_NODE); then npx mocha; else npx c8 mocha; fi

.PHONY: test
