/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.INTERFACE({
  package: 'foam.nanos.auth',
  name: 'LastModifiedByAware',

  properties: [
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'lastModifiedBy',
      createVisibility: 'HIDDEN',
      updateVisibility: 'RO',
      documentation: 'User who last modified entry',
      storageOptional: true
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'lastModifiedByAgent',
      createVisibility: 'HIDDEN',
      updateVisibility: 'RO',
      documentation: 'Agent acting as User who last modified entry',
      storageOptional: true
    }
  ]
});


/**
 * This refinement is necessary because of the way the class loader works.
 * There wasn't a way in which User could implement LastModifiedByAware and the
 * LastModifiedAware interface to have a reference property without doing this refinement
 */
foam.CLASS({
  package: 'foam.nanos.auth',
  name: 'UserLastModifiedByRefinement',
  refines: 'foam.nanos.auth.User',

  implements: [
    'foam.nanos.auth.LastModifiedByAware'
  ],

  properties: [
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'lastModifiedBy',
      documentation: 'User who last modified entry',
      createVisibility: 'HIDDEN',
      updateVisibility: 'RO',
      section: 'userInformation',
      gridColumns: 6
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'lastModifiedByAgent',
      documentation: 'Agent acting as user who last modified entry',
      createVisibility: 'HIDDEN',
      updateVisibility: 'RO',
      section: 'userInformation',
      gridColumns: 6
    }
  ]
});
