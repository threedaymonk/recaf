.PHONY:	all lint test loc

SRC_FILES=`find ./lib -name '*.js'`
TEST_FILES=`find ./test -name 'test-*.js'`

all:	lint test

lint:
	@jshint $(SRC_FILES)

test:
	@nodeunit $(TEST_FILES)

loc:
	@grep -r --binary-files=without-match . $(SRC_ROOT) | wc -l | xargs -I_ echo _ LoC
