Feature: Test the trello API with access token and Post、Delete requests.

  Background:
    * url "https://trello.com/1/"

  Scenario: Test Post and delete for trello card.

    * def idList = "idList"
    * def key = "key"
    * def token = "token"

    Given   path "cards"
    And     param key = key
    And     param token = token
    And     param idList = idList
    And     param name = "旅遊行程事項"
    And     param desc = "旅遊需要準備以及確認的事項"
    When    method Post
    Then    status 200
    And    match response.name ==  "旅遊行程事項"
    * def idCard = response.id
    * print idCard

    Given  path "cards", idCard
    And    param key = key
    And    param token = token
    When   method Delete
    Then   status 200
    * print response
    And    match response == { limits: {} }

