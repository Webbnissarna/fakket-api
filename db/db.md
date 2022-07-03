# Fakket

## A basic market

GraphQL interface

```mermaid
erDiagram
    Price {
        numeric value
        date updateDate
    }
    PriceHistory {
        price_array history
        number m1
        number m3
        number m6
        number m12
        number m24
        number m60
        number m120
    }
    Stock {
        PriceHistory priceHistory
        date latestUpdate
        string id
        string currency
    }
    User {
        Holding_array holdings 
        string name
        string id
    }
    Holding {
        Company company
        numeric count
        Stock stock
        string id
    }
    Company {
        string name
        numeric industry
        string country
        User_array owners
        string orgId
    }
    User ||--o{ Holding : have
    Holding ||--|| Company : represents
    Holding ||--|| Stock : represents
    Stock ||--|| PriceHistory : has
    PriceHistory ||--o{ Price : has
```

PostgreSQL interface

```mermaid
erDiagram
    Price {
        numeric Value
        date updateDate
    }
    Stock {
        Price priceHistory
        numeric m1
        numeric m3
        numeric m6
        numeric m12
        numeric m24
        numeric m60
        numeric m120
        date latestUpdate
        string id
        string currency
    }
    User {
        string_array holdings 
        string name
        string id
    }
    Holding {
        string orgId
        numeric count
        string stockId
        string id
    }
    Company {
        string name
        numeric industry
        string country
        user_array owners
        string orgId
    }
    User ||--o{ Holding : have
    Holding ||--|| Company : represents
    Holding ||--|| Stock : represents
    Stock ||--o{ Price : has
```

## Mappings

Description of the different names and numbers that represents industries, time periods etc.

### Industry

0 = tech
1 = agriculture
2 = healthcare

### Time periods

m1 = one month back
m3 = one quarter back
m6 = a half year back
m12 = a year back
m24 = two years back
m60 = five years back
m120 = ten years back

## Datapoint explanations

Explanations of the different data points for each query/table

### Company

- name : name of the company
- industry : number representing the industry, see [Industry mapping](#industry-mapping)
- country : string containing country ISO-code
- owners : array of owners
- orgId : string containing the organisation number