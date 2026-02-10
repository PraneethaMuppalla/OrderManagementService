# Menu API Pagination Requirements

This document outlines the backend API requirements for the infinite scroll pagination implementation.

## API Endpoint

### GET `/api/menu`

This endpoint should support cursor-based pagination with filtering capabilities.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cursor` | number | No | The cursor position for pagination (default: 0) |
| `limit` | number | No | Number of items per page (default: 12) |
| `category` | string | No | Filter by category (omit or use "all" for no filter) |
| `search` | string | No | Search term to filter items by name/description |

#### Example Requests

```bash
# Get first page (12 items)
curl --location 'http://localhost:5000/api/menu?cursor=0&limit=12' \
--header 'Authorization: Bearer YOUR_TOKEN'

# Get second page
curl --location 'http://localhost:5000/api/menu?cursor=12&limit=12' \
--header 'Authorization: Bearer YOUR_TOKEN'

# Filter by category
curl --location 'http://localhost:5000/api/menu?cursor=0&limit=12&category=Pizza' \
--header 'Authorization: Bearer YOUR_TOKEN'

# Search items
curl --location 'http://localhost:5000/api/menu?cursor=0&limit=12&search=cheese' \
--header 'Authorization: Bearer YOUR_TOKEN'

# Combined filters
curl --location 'http://localhost:5000/api/menu?cursor=0&limit=12&category=Burgers&search=bacon' \
--header 'Authorization: Bearer YOUR_TOKEN'
```

#### Response Format

```typescript
{
  "items": Product[],      // Array of menu items for this page
  "nextCursor": number | null,  // Cursor for next page (null if no more items)
  "hasMore": boolean,      // Whether there are more items to load
  "total": number          // Total number of items matching the filters
}
```

#### Example Response

```json
{
  "items": [
    {
      "id": 1,
      "name": "Margherita Pizza",
      "description": "Classic pizza with tomato sauce, mozzarella, and basil.",
      "price": "12.99",
      "image_url": "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38",
      "category": "Pizza",
      "is_available": true,
      "inventory_count": 50,
      "low_stock_threshold": 5,
      "createdAt": "2026-02-09T16:18:07.251Z",
      "updatedAt": "2026-02-09T16:18:07.251Z"
    }
    // ... 11 more items
  ],
  "nextCursor": 12,
  "hasMore": true,
  "total": 45
}
```

## Backend Implementation Guide

### Cursor-Based Pagination Logic

```javascript
// Example implementation (Node.js/Express with Sequelize)
router.get('/menu', async (req, res) => {
  try {
    const { 
      cursor = 0, 
      limit = 12, 
      category, 
      search 
    } = req.query;

    const offset = parseInt(cursor);
    const pageSize = parseInt(limit);

    // Build where clause
    const where = {
      is_available: true  // Only show available items
    };

    // Add category filter
    if (category && category !== 'all') {
      where.category = category;
    }

    // Add search filter
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Get total count for this query
    const total = await MenuItem.count({ where });

    // Fetch items
    const items = await MenuItem.findAll({
      where,
      limit: pageSize,
      offset,
      order: [['id', 'ASC']]  // Consistent ordering is crucial
    });

    // Calculate next cursor
    const nextCursor = offset + items.length;
    const hasMore = nextCursor < total;

    res.json({
      items,
      nextCursor: hasMore ? nextCursor : null,
      hasMore,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
});
```

### Important Considerations

1. **Consistent Ordering**: Always use the same `ORDER BY` clause to ensure consistent pagination
2. **Available Items Only**: Filter by `is_available: true` to only show items in stock
3. **Case-Insensitive Search**: Use `ILIKE` (PostgreSQL) or equivalent for search
4. **Performance**: Add database indexes on:
   - `category` column
   - `is_available` column
   - `name` column (for search)
   - Composite index on `(is_available, category)` for filtered queries

### Database Indexes (SQL)

```sql
-- Add these indexes for optimal performance
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_menu_items_name ON menu_items(name);
CREATE INDEX idx_menu_items_available_category ON menu_items(is_available, category);
```

## Frontend Features

The frontend implementation includes:

✅ **Cursor-based pagination** - More efficient than offset-based
✅ **Infinite scroll** - Automatic loading as user scrolls
✅ **Intersection Observer** - Loads 200px before reaching bottom
✅ **Debounced search** - 500ms delay to reduce API calls
✅ **Server-side filtering** - Category and search handled by backend
✅ **Loading states** - Initial load, fetching next page, and end of results
✅ **Manual load button** - Fallback if auto-scroll fails
✅ **Query caching** - TanStack Query caches results for 5 minutes
✅ **Optimistic updates** - Smooth UX with proper loading indicators

## Testing the Implementation

1. **Test pagination**: Scroll to bottom and verify new items load
2. **Test search**: Type in search box and verify debouncing works
3. **Test category filter**: Change category and verify results update
4. **Test combined filters**: Use search + category together
5. **Test end of results**: Scroll to end and verify "end of menu" message
6. **Test error handling**: Simulate API failure and verify error display
7. **Test loading states**: Verify spinners appear during loading

## Performance Metrics

- **Initial load**: ~12 items
- **Items per page**: 12 (configurable)
- **Search debounce**: 500ms
- **Cache duration**: 5 minutes (stale time)
- **Prefetch distance**: 200px before bottom
- **Network requests**: Minimized via caching and debouncing
