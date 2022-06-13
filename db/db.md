# Fakket

## A basic market

GraphQL interface

```mermaid
erDiagram
    Stock {
        numeric_array priceHistory
        date latestUpdate
        string id
        string currency
    }
    User {
        holding_array holdings 
        string name
        string id
    }
    Holding {
        Company company
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
```

## Industry mapping

0 = tech
1 = agriculture
2 = healthcare
3 = 

## Datapoint explanations

### Company

- name : name of the company
- industry : number representing the industry, see [Industry mapping](#industry-mapping)
- country : string containing country ISO-code
- owners : array of owners
- orgId : string containing the organisation number