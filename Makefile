OUT_DIR := out

before-build-server = $(OUT_DIR)/node_modules
build-server-cmd = node_modules/.bin/tsc -p src/server/tsconfig.json $(1)

$(OUT_DIR)/node_modules:
	mkdir -p $@
	ln -s ../server/src $@/server
	ln -s ../server/tests $@/tests

.PHONY: deps
deps:
	npm ci

.PHONY: build-server
build-server: $(before-build-server)
	$(call build-server-cmd)

.PHONY: build-client
build-client:
	@node_modules/.bin/webpack --config ./src/client/webpack.config.ts

.PHONY: build-client-production
build-client-production:
	@node_modules/.bin/webpack --config ./src/client/webpack.config.ts --mode production

.PHONY: clean
clean:
	@rm -rf $(OUT_DIR)

.PHONY: validate
validate: lint
	$(call build-server-cmd,--noEmit)

.PHONY: lint
lint:
	@node_modules/.bin/eslint src/server --ext .ts --fix
	@node_modules/.bin/eslint src/client --ext .tsx,.ts --fix

.PHONY: dev
dev:
	$(MAKE) -j2 server-dev client-dev

.PHONY: client-dev
client-dev:
	@node_modules/.bin/webpack --watch --config ./src/client/webpack.config.ts

.PHONY: server-dev
server-dev:
	@node_modules/.bin/nodemon \
		--exec " \
			node_modules/.bin/ts-node \
				--files=true \
				-r tsconfig-paths/register \
				--project ./src/server/tsconfig.json \
				./src/server/src/app.ts" \
		-w src/server \
		-e ts,json

.PHONY: tests
tests: build-server
	@ENVIRONMENT=tests \
		DISABLE_LOGGING=1 \
		node_modules/.bin/jest --config=jest.config.json --runInBand --forceExit

.PHONY: migrate-db
migrate-db: build-server
	@node $(OUT_DIR)/server/tools/create-tables.js

.PHONY: migrate-test-db
migrate-test-db: build-server
	@ENVIRONMENT=tests \
		node $(OUT_DIR)/server/tools/create-tables.js
