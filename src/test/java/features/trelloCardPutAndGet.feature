Feature: Test the trello API with access token and Put、Get requests.

  Background:
    * url "https://trello.com/1/"

  Scenario: Test Put and Get for trello card.

    * def idCard = "idCard"
    * def key = "key"
    * def token = "token"

    Given   path "cards", idCard
    And     param key = key
    And     param token = token
    And     param desc = "For test three different type API"
    When    method Put
    Then    status 200
    * print response

    Given  path "cards", idCard
    And    param key = key
    And    param token = token
    When   method Get
    Then   status 200
    And    match response.desc ==  "For test three different type API"

    Given   path "cards", idCard
    And     param key = key
    And     param token = token
    And     param desc = ""
    When    method Put
    Then    status 200
    * print response
    And    match response.desc ==  ""