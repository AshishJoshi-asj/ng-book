'use strict';

// Our google services module
angular.module('googleServices', [])
  .factory('googleApi', 
    ['$window', '$document', '$q', '$rootScope', 
    function($window, $document, $q, $rootScope) {
      // Create a defer to encapsulate the loading of
      // our Google API service. 
      var d = $q.defer();

      // After the script loads in the browser, we're going
      // to call this function, which in turn will resolve
      // our global defer which enables the 
      $window.bootGoogleApi = function(keys) {
        // We need to set our API key
        window.gapi.client.setApiKey(keys.apiKey);
        $rootScope.$apply(function() {
          d.resolve(keys);
        });
      };

      // Load client in the browser
      var scriptTag = $document[0].createElement('script');
      scriptTag.type = 'text/javascript'; 
      scriptTag.async = true;
      scriptTag.src = 'https://apis.google.com/js/client:plusone.js?onload=onLoadCallback';
      var s = $document[0].getElementsByTagName('body')[0];
      s.appendChild(scriptTag);

      // Return a singleton object that returns the 
      // promise
      return {
        gapi: function() { return d.promise; }
      }
  }])
  
  // Our auth API integration
  // we should never call this service directly (unless 
  // you really really want to); it's used by the 
  // googleLoginApi service
  .factory('googleAuthApi', 
    ['$window', '$timeout', '$rootScope', '$q', 'googleApi',
    function($window, $timeout, $rootScope, $q, googleApi) {

      // The authorize function will call google auth.authorize
      // which will authorize this browser client to
      // the user's account along with the appropriate
      // scopes. It will then call `handleAuthResult` with
      // the promise to resolve
      var authorize = function(keys, firstCheck) {
        var d = $q.defer();
        gapi.auth.authorize({
          client_id: keys.clientId,
          scope: keys.scopes.join(" "),
          immediate: firstCheck
        }, handleAuthResult(d));

        return d.promise;
      };

      // handleAuthResult simple resolves the deferred
      // object if there are no errors. If there are errors
      // then simply reject the promise
      var handleAuthResult = function(defer) {
        return function(authResult) {
          if (authResult && !authResult.error) {
            defer.resolve(authResult);
          } else {
            defer.reject();
          }
        }
      };

    // After the gapi client has loaded, call authorize
    // This gets called immediately on load. We call
    // true as the immediate check as this will call
    // authorize with a true immediate check. If the user
    // is logged in, then this will call authorize on the
    // browser immediately.
    googleApi.gapi().then(function(keys) {
      // First authorize check
      authorize(keys, true)
    });

    // return a singleton object
    return {
      authorize: authorize
    }
  }])
  // Our google Login api service
  .factory('googleLoginApi', 
    ['$q', '$rootScope', 'googleAuthApi', 'googleApi',
    function($q, $rootScope, googleAuthApi, googleApi) {
      // Create a load deferred object
      var loadedDefer = $q.defer(),
          loadedPromise = loadedDefer.promise,
          _loggedInUser = null,
          keys = null;

      // Create a login function
      // Inside this login function, we'll return a 
      // deferred object and then attempt to authorize
      // and find user data
      var login = function() {
        var d = $q.defer();

        // getUserInfo waits until the gapi login 
        // service has loaded (using the loadedPromise)
        // and then immediately calls 
        // gapi.client.oauth2.userinfo.get() to fetch
        // google data. It calls the `success` callback
        // if it's successful and the `fail` callback
        // if unsuccessful
        var getUserInfo = function(success, fail) {
          loadedPromise.then(function() {
            gapi.client.oauth2.userinfo.get()
            .execute(function(resp) {
              if (resp.email) success(resp);
              else fail(resp);
            });
          });
        };

        // resolveUserInfo resolves user data
        // from google and takes care of calling the 
        // getUserInfo for us. It will also save and
        // cache the resolved user so we never call the
        // gapi session during the same browser load
        var resolveUserInfo = function(d) {
          getUserInfo(function success(resp) {
            // Resolve the response
            $rootScope.$apply(function() {
              d.resolve(resp);
            });
          },
          // Our failure function
          function fail(resp) {
            // If the response code is 401 (unauthorized)
            // then call authorize on the `googleAuthApi`
            // without being immediate (false)
            // and call resolveUserInfo to get the user's
            // info on load
            if (resp.code === 401) {
              googleAuthApi.authorize(keys, false)
                .then(function() {
                  resolveUserInfo(d);
                });
            } else {
              d.reject(resp);
            }
          });
        };

        // Call resolve immediately
        resolveUserInfo(d);

        return d.promise;
      }

      // call to load the oauth2 module on the 
      // gapi client immediately. 
      // When it's loaded, resolve the loadedDefer object
      googleApi.gapi().then(function(_keys) {
        keys = _keys;
        gapi.client.load('oauth2', 'v2', function () {
          loadedDefer.resolve(keys);
        });
      });

      // return our singleton object with two methods
      // login (the login function) and the 
      // getLoggedInStatus which will return a promise
      // that resolves to the user info
      return {
        login: login,
        getLoggedInStatus: function() {
          return loadedPromise;
        }
      }
  }])
  .factory('googleCalendarApi', 
    ['$timeout', '$q', '$rootScope', 'googleApi',
    function($timeout, $q, $rootScope, googleApi) {
      var calendarCache = [],
          loadedCalendar = $q.defer(),
          loadedPromise = loadedCalendar.promise;


    // After the calendar is loaded, call the load
    // on the raw Google calendar API
    // If the list comes back with calendars, then 
    // resolve the deferred object, otherwise
    // reject it
    var getCalendars = function(cb) {
      var d = $q.defer()
      if (calendarCache.length > 0) {
        d.resolve(calendarCache);
      } else {
        loadedPromise.then(function(keys) {
          gapi.client.calendar.calendarList.list({}).execute(function(resp) {
            // If the response is 401 (unauthorized)
            // then we know the user needs to login
            // so fire off the `user:login_required` event
            if (resp.code == 401) {
              $rootScope.$broadcast('user:login_required');
            } else {
              // otherwise, if we have calendar items in 
              // the response, then we know the API call
              // was successful so we'll resolve the 
              // calendar request
              if (resp && resp.items) {
                calendarCache = resp.items;
                $rootScope.$apply(function() {
                  d.resolve(calendarCache);
                });
              } else {
                d.reject(resp);
              }
            }
          });
        });
      }
      return d.promise;
    };

    // Get a specific calendar by `id`.
    // Since we are using the `getCalendars()` function
    // from above, we know that we can depend on the 
    // gapi client and calendar service to be loaded.
    // We'll simply walk through the list of calendars 
    // in our cache and find the one with the right "summary"
    var getCalendar = function(id) {
      var d = $q.defer();

      var calendars = getCalendars()
      calendars.then(function(calendars) {
        var i = 0,
            c = null;
        for (i = 0; i < calendars.length; i++) {
          c = calendars[i];
          if (c.summary === id) {
            d.resolve(c);
          }
        }
        d.reject("Not found");
      });

      return d.promise;
    }

    var createCalendar = function(id, cb) {
      // gapi.client.calendar.calendars.insert({
      //   'summary': id
      // }).execute(function(resp) {
      //   console.log("createCalendar", resp);
      //   if (resp.code == 200) {
      //     console.log(resp);
      //     return true;
      //   } else {
      //     return false;
      //   }
      // })
    }

    // getEventsForCalendar uses the `getCalendar()` function
    // from above so we can depend upon the gapi client
    // and the calendar service to be loaded.
    // This function will call the gapi calendar client
    // for the list of events for a specific calendar
    var getEventsForCalendar = function(id, opts) {
      var d = $q.defer()
      
      var c = getCalendar(id);
      c.then(function(c) {
        gapi.client.calendar.events.list({
          'calendarId': c.id
        }).execute(function(resp) {
          $rootScope.$apply(function() {
            d.resolve(resp.items);
          });
        });
      });

      return d.promise;
    }

    //tomorrow at 2pm with @eigenjoy #work
    // addEventToCalendar will take an event and a 
    // calendar id. Since it uses the `getCalendar()` 
    // function from above, we can depend upon the gapi
    // client and calendar api to be loaded
    // This will create a date object and use the gapi
    // client to store the event to the calendar by 
    // id
    var addEventToCalendar = function(evt, id) {
      var d = $q.defer();

      getCalendar(id).then(function(c) {
        var dateobj = {
          'calendarId': c.id,
          'resource': {
            'summary': evt.raw,
            'start': {
              'dateTime': evt.date
            },
            'end': {
              'dateTime': evt.date
            },
            'extendedProperties': {
              'shared': {
                'tags': evt.tags?evt.tags.join(',') : '',
                'urls': evt.urls?evt.urls.join(',') : '',
                'users': evt.users?evt.users.join(',') : ''
              }
            }
          }
        }
        gapi.client.calendar.events.insert(dateobj)
        .execute(function(resp) {
          $rootScope.$apply(function() {
            d.resolve(resp);
          });
        });
      });

      return d.promise;
    }

    // Remove an event from a calendar by the 'id'
    // Since this method uses the `getCalendar()` method
    // from above, we can depend upon the calendar api
    // and gapi client to be loaded. This function will
    // use the calendar id and the event id to remove it
    // from the remote calendar
    var deleteEventFromCalendar = function(evtId, id) {
      var d = $q.defer();
      getCalendar(id)
      .then(function(c) {
        gapi.client.calendar.events.delete({
          'calendarId': c.id,
          'eventId': evtId
        }).execute(function(r) {
          $rootScope.$apply(function(resp) {
            d.resolve(r);
          })
        });
      });

      return d.promise;
    }

    // First, call to load the calendar api
    // after the gapi client is loaded
    // and then resolve the loadedCalendar deferred object
    googleApi.gapi().then(function(keys) {
      gapi.client.load('calendar', 'v3', function() {
        // Loaded calendar after here
        loadedCalendar.resolve();
      });
    });

    // Return our singleton object
    return {
      getCalendar: getCalendar,
      getCalendars: getCalendars,
      createCalendar: createCalendar,
      getEventsForCalendar: getEventsForCalendar,
      addEventToCalendar: addEventToCalendar,
      deleteEventFromCalendar: deleteEventFromCalendar
    };
  }]);