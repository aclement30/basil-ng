//'use strict';
// Declare app level module which depends on filters, and services
angular.module('basilApp', [
        'basilApp.controllers',
        'basilApp.directives',
        'basilApp.filters',
        'basilApp.services',
        'ui.router',
        'ngMaterial',
        'ngResource',
        'ngMessages',
        'ngSanitize',
        'angularMoment',
        'md.data.table',
        'LocalStorageModule'
    ])
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    .constant('KITCHEN_EVENTS', {
        cookingRecipesUpdate: 'cooking-recipes-update'
    })
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$mdThemingProvider',
        '$mdIconProvider',
        '$mdDateLocaleProvider',
        'moment',
        '$httpProvider',
        'localStorageServiceProvider',

        function($stateProvider,
                 $urlRouterProvider,
                 $mdThemingProvider,
                 $mdIconProvider,
                 $mdDateLocaleProvider,
                 moment,
                 $httpProvider,
                 USER_ROLES,
                 localStorageServiceProvider) {

            /*localStorageServiceProvider
                .setPrefix('basil');*/

            $urlRouterProvider.otherwise('/recipes');

            $stateProvider
                .state('recipes', {
                    url: '/recipes',
                    templateUrl: 'views/index/index.html',
                    controller: 'IndexController',
                    controllerAs: 'ctrl'
                })
                .state('new', {
                    url: '/recipes/add',
                    templateUrl: 'views/edit/edit.html',
                    controller: 'EditController',
                    controllerAs: 'ctrl'
                })
                .state('detail', {
                    url: '/recipes/{id}',
                    templateUrl: 'views/detail/detail.html',
                    controller: 'DetailController',
                    controllerAs: 'ctrl'
                })
                .state('edit', {
                    url: '/recipes/{id}/edit',
                    templateUrl: 'views/edit/edit.html',
                    controller: 'EditController',
                    controllerAs: 'ctrl'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.html',
                    controller: 'LoginController',
                    data: {
                        currentSection: {
                            title: 'Connexion',
                            state: 'login'
                        }
                    }
                });

            $mdIconProvider
                .defaultFontSet('material-icons');

            $mdThemingProvider.theme('default')
                .primaryPalette('teal')
                .accentPalette('lime')
                .warnPalette('deep-orange')
                .backgroundPalette('grey');

            $mdDateLocaleProvider.months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
            $mdDateLocaleProvider.shortMonths = ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
            $mdDateLocaleProvider.days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
            $mdDateLocaleProvider.shortDays = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
            $mdDateLocaleProvider.firstDayOfWeek = 1;
            $mdDateLocaleProvider.formatDate = function(date) {
                return moment(date).format('DD.MM.YYYY');
            };
            $mdDateLocaleProvider.msgCalendar = 'Calendrier';
            $mdDateLocaleProvider.msgOpenCalendar = 'Ouvrir le calendrier';

            $httpProvider.interceptors.push([
                '$injector',
                function ($injector) {
                    return $injector.get('AuthInterceptor');
                }
            ]);
        }
    ])
    .run([
        '$rootScope',
        'amMoment',
        'Auth',
        'AUTH_EVENTS',
        '$state',

        function ($rootScope, amMoment, Auth, AUTH_EVENTS, $state) {
            amMoment.changeLocale('fr');

            $rootScope.currentPage = {
                requests: {}
            };

            $rootScope.serverIsOnline = true;
            $rootScope.tasks = {};

            /*$rootScope.$on('$stateChangeStart', function (event, next) {
                if (!Auth.isAuthenticated()) {
                    event.preventDefault();

                    // User is not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }

                if (next.name == 'login' && Auth.isAuthenticated()) {
                    event.preventDefault();
                    $state.go('recipes');
                }
            });*/

            $rootScope.$on(AUTH_EVENTS.loginFailed, function(event){
                $state.go('login');
            });
        }
    ]);

angular.module('basilApp.controllers', []);
angular.module('basilApp.filters', []);
angular.module('basilApp.services', []);
angular.module('basilApp.directives', []);