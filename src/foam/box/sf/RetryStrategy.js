/**
* @license
* Copyright 2021 The FOAM Authors. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

foam.ENUM({
	package: 'foam.box.sf',
	name: 'RetryStrategy',
	
	values: [
		{
			name: 'CONST_FOUR_SECOND',
			ordinal: 0,
		},
		{
			name: 'INCREMENT_ONE_SECOND',
			ordinal: 1,
		}
	],

	axioms: [
    {
      name: 'javaExtras',
      buildJavaClass: function(cls) {
        cls.extras.push(foam.java.Code.create({
          data: `
						public long next(long cur) {
							switch ( this ) {
								case CONST_FOUR_SECOND:
									return 4000;
								case INCREMENT_ONE_SECOND:
									return cur + 1000;
								default:
									throw new RuntimeException("unsupport operation");
							}
						}
          `
        }));
      }
    }
  ]
})