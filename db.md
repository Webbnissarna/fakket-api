```mermaid
erDiagram
    Stock {
        string companyName
        numeric_array priceHistory
        string country
        string id
        string latestUpdate
        int industry
        numeric currentPrice
        string currency
        string_array holders
    }
    User {
        holding_array holdings
        string name
        string id
    }
    Company {
        user_array owners
    }
    Holding {
        user owner
        stock stock
        numeric percentage
    }
    User }o--o{ Stock : Has
```
Industry mapping

0 = tech
1 = agriculture
2 = healthcare
3 = 