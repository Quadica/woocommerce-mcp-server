# WooCommerce MCP Server On The Luxeon Site

A Model Context Protocol (MCP) server for WooCommerce integration, compatible with Windows, macOS, and Linux.

## Overview

This MCP server enables interaction with our WooCommerce stores through the WordPress REST API. It provides comprehensive tools for managing all aspects of products, orders, customers, shipping, taxes, discounts, and store configuration using JSON-RPC 2.0 protocol.

A MCP server created using this repo is currently deployed as the **luxeon-mcp** service on our elestio account [our elestio account](https://github.com/warrisr/gitlux/blob/main/docs/wordpress-environment.md)

The deployment of this repo on elestio was long and complex, but was ultimately successful. See the ai-setup-chat.md document in the docs folder for a complete transcript of the process. Only the very last part is relevant. The first 90% wa just the process of debugging the deployment on elestio.


## Deployment on Elestio
This application is a command-line tool and not a standard web server. To deploy it as a web-accessible API in our Elestio account, it must be wrapped in a web server (like Express), and the platform's Docker environment must be configured correctly.

The deployment process requires the following key configurations:

### 1. Web Server Wrapper
A server.js file has been added to the root of the project. This file creates an Express.js server that listens for HTTP requests and executes the core application (build/index.js) as a child process, piping data back and forth.

### 2. Environment Variables
The application requires the following environment variables to be set in the Elestio "ENV" tab for the luxeonstar.com site:

```
DOMAIN=luxeon-mcp-u44324.vm.elestio.app
WORDPRESS_SITE_URL=https://stg-luxeonstarleds-lxplugin.kinsta.cloud/
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxx
WORDPRESS_USERNAME=ronw
WORDPRESS_PASSWORD=xxxxx
```

### 3. Docker Compose Configuration
The Elestio "Docker Compose" configuration for the app service must be modified to correctly run the application. The final app service definition should look like this:

```
app:
   build:
    context: ./nodejs
    dockerfile: Dockerfile
    args:
      - SOFTWARE_VERSION_TAG=${SOFTWARE_VERSION_TAG}
   restart: unless-stopped
   container_name: app-nodejs
   ports:
    - '172.17.0.1:3000:3000'
   volumes:
     - /usr/src/app:/usr/src/app
   working_dir: /usr/src/app
   env_file:
     - .env
   command: npm start
   depends_on:
    - redis
```

## API Methods

The server supports both WordPress and WooCommerce API methods. Here's a list of available methods grouped by category:

### WordPress Content Management

These methods require WordPress username/password credentials and are independent of the WooCommerce API.

| Method | Description |
|--------|-------------|
| `create_post` | Create a new WordPress post |
| `get_posts` | Retrieve WordPress posts |
| `update_post` | Update an existing WordPress post |
| `get_post_meta` | Get post metadata |
| `update_post_meta` | Update post metadata |
| `create_post_meta` | Create post metadata |
| `delete_post_meta` | Delete post metadata |

### WooCommerce Products

| Method | Description |
|--------|-------------|
| `get_products` | Retrieve a list of products |
| `get_product` | Get a single product by ID |
| `create_product` | Create a new product |
| `update_product` | Update an existing product |
| `delete_product` | Delete a product |
| `get_product_meta` | Get product metadata |
| `create_product_meta` | Create/update product metadata |
| `update_product_meta` | Update product metadata (alias for create) |
| `delete_product_meta` | Delete product metadata |

### Product Categories

| Method | Description |
|--------|-------------|
| `get_product_categories` | Retrieve product categories |
| `get_product_category` | Get a single product category |
| `create_product_category` | Create a new product category |
| `update_product_category` | Update a product category |
| `delete_product_category` | Delete a product category |

### Product Tags

| Method | Description |
|--------|-------------|
| `get_product_tags` | Retrieve product tags |
| `get_product_tag` | Get a single product tag |
| `create_product_tag` | Create a new product tag |
| `update_product_tag` | Update a product tag |
| `delete_product_tag` | Delete a product tag |

### Product Attributes

| Method | Description |
|--------|-------------|
| `get_product_attributes` | Retrieve product attributes |
| `get_product_attribute` | Get a single product attribute |
| `create_product_attribute` | Create a new product attribute |
| `update_product_attribute` | Update a product attribute |
| `delete_product_attribute` | Delete a product attribute |
| `get_attribute_terms` | Retrieve attribute terms |
| `get_attribute_term` | Get a single attribute term |
| `create_attribute_term` | Create a new attribute term |
| `update_attribute_term` | Update an attribute term |
| `delete_attribute_term` | Delete an attribute term |

### Product Variations

| Method | Description |
|--------|-------------|
| `get_product_variations` | Retrieve product variations |
| `get_product_variation` | Get a single product variation |
| `create_product_variation` | Create a new product variation |
| `update_product_variation` | Update a product variation |
| `delete_product_variation` | Delete a product variation |

### Product Reviews

| Method | Description |
|--------|-------------|
| `get_product_reviews` | Retrieve product reviews |
| `get_product_review` | Get a single product review |
| `create_product_review` | Create a new product review |
| `update_product_review` | Update a product review |
| `delete_product_review` | Delete a product review |

### WooCommerce Orders

| Method | Description |
|--------|-------------|
| `get_orders` | Retrieve a list of orders |
| `get_order` | Get a single order by ID |
| `create_order` | Create a new order |
| `update_order` | Update an existing order |
| `delete_order` | Delete an order |
| `get_order_meta` | Get order metadata |
| `create_order_meta` | Create/update order metadata |
| `update_order_meta` | Update order metadata (alias for create) |
| `delete_order_meta` | Delete order metadata |

### Order Notes

| Method | Description |
|--------|-------------|
| `get_order_notes` | Retrieve order notes |
| `get_order_note` | Get a single order note |
| `create_order_note` | Create a new order note |
| `delete_order_note` | Delete an order note |

### Order Refunds

| Method | Description |
|--------|-------------|
| `get_order_refunds` | Retrieve order refunds |
| `get_order_refund` | Get a single order refund |
| `create_order_refund` | Create a new order refund |
| `delete_order_refund` | Delete an order refund |

### WooCommerce Customers

| Method | Description |
|--------|-------------|
| `get_customers` | Retrieve a list of customers |
| `get_customer` | Get a single customer by ID |
| `create_customer` | Create a new customer |
| `update_customer` | Update an existing customer |
| `delete_customer` | Delete a customer |
| `get_customer_meta` | Get customer metadata |
| `create_customer_meta` | Create/update customer metadata |
| `update_customer_meta` | Update customer metadata (alias for create) |
| `delete_customer_meta` | Delete customer metadata |

### Shipping

| Method | Description |
|--------|-------------|
| `get_shipping_zones` | Retrieve shipping zones |
| `get_shipping_zone` | Get a single shipping zone |
| `create_shipping_zone` | Create a new shipping zone |
| `update_shipping_zone` | Update a shipping zone |
| `delete_shipping_zone` | Delete a shipping zone |
| `get_shipping_methods` | Retrieve shipping methods |
| `get_shipping_zone_methods` | Get shipping methods for a zone |
| `create_shipping_zone_method` | Create a new shipping method for a zone |
| `update_shipping_zone_method` | Update a shipping method for a zone |
| `delete_shipping_zone_method` | Delete a shipping method from a zone |
| `get_shipping_zone_locations` | Get locations for a shipping zone |
| `update_shipping_zone_locations` | Update locations for a shipping zone |

### Taxes

| Method | Description |
|--------|-------------|
| `get_tax_classes` | Retrieve tax classes |
| `create_tax_class` | Create a new tax class |
| `delete_tax_class` | Delete a tax class |
| `get_tax_rates` | Retrieve tax rates |
| `get_tax_rate` | Get a single tax rate |
| `create_tax_rate` | Create a new tax rate |
| `update_tax_rate` | Update a tax rate |
| `delete_tax_rate` | Delete a tax rate |

### Discounts/Coupons

| Method | Description |
|--------|-------------|
| `get_coupons` | Retrieve coupons |
| `get_coupon` | Get a single coupon |
| `create_coupon` | Create a new coupon |
| `update_coupon` | Update a coupon |
| `delete_coupon` | Delete a coupon |

### Payment Gateways

| Method | Description |
|--------|-------------|
| `get_payment_gateways` | Retrieve payment gateways |
| `get_payment_gateway` | Get a single payment gateway |
| `update_payment_gateway` | Update a payment gateway |

### Reports

| Method | Description |
|--------|-------------|
| `get_sales_report` | Retrieve sales reports |
| `get_products_report` | Retrieve products reports |
| `get_orders_report` | Retrieve orders reports |
| `get_categories_report` | Retrieve categories reports |
| `get_customers_report` | Retrieve customers reports |
| `get_stock_report` | Retrieve stock reports |
| `get_coupons_report` | Retrieve coupons reports |
| `get_taxes_report` | Retrieve taxes reports |

### Settings

| Method | Description |
|--------|-------------|
| `get_settings` | Retrieve all settings |
| `get_setting_options` | Retrieve options for a setting |
| `update_setting_option` | Update a setting option |

### System Status

| Method | Description |
|--------|-------------|
| `get_system_status` | Retrieve system status |
| `get_system_status_tools` | Retrieve system status tools |
| `run_system_status_tool` | Run a system status tool |

### Data

| Method | Description |
|--------|-------------|
| `get_data` | Retrieve store data |
| `get_continents` | Retrieve continents data |
| `get_countries` | Retrieve countries data |
| `get_currencies` | Retrieve currencies data |
| `get_current_currency` | Get the current currency |

## Method Parameters

All methods follow a similar parameter structure. Here are some examples:

### Common Parameters for All Methods

- `siteUrl`: (optional if set in env) WordPress site URL

### Additional Parameters for WooCommerce Methods

- `consumerKey`: (optional if set in env) WooCommerce consumer key
- `consumerSecret`: (optional if set in env) WooCommerce consumer secret

### Additional Parameters for WordPress Methods

- `username`: (optional if set in env) WordPress username
- `password`: (optional if set in env) WordPress password

## Example Usage

### WordPress API Example

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "create_post",
  "params": {
    "siteUrl": "https://your-wordpress-site.com",
    "username": "your-wordpress-username",
    "password": "your-wordpress-password",
    "title": "My New Blog Post",
    "content": "This is the content of my new blog post.",
    "status": "publish"
  }
}
```

### WooCommerce Products Example

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "get_products",
  "params": {
    "perPage": 20,
    "page": 1,
    "filters": {
      "category": 19,
      "status": "publish"
    }
  }
}
```

### Create Product Example

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "create_product",
  "params": {
    "productData": {
      "name": "Premium T-Shirt",
      "type": "simple",
      "regular_price": "29.99",
      "description": "Comfortable cotton t-shirt, available in various sizes.",
      "short_description": "Premium quality t-shirt.",
      "categories": [
        {
          "id": 19
        }
      ],
      "images": [
        {
          "src": "http://example.com/wp-content/uploads/2022/06/t-shirt.jpg"
        }
      ]
    }
  }
}
```

### Product Metadata Example

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "create_product_meta",
  "params": {
    "productId": 456,
    "metaKey": "_custom_product_field",
    "metaValue": {
      "special_attribute": "value",
      "another_attribute": 42
    }
  }
}
```

### Order Metadata Example

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "create_order_meta",
  "params": {
    "orderId": 789,
    "metaKey": "_delivery_instructions",
    "metaValue": "Leave package at the back door"
  }
}
```

## Security Note

For WooCommerce REST API access, you need to generate API keys. You can create them in your WordPress dashboard under WooCommerce → Settings → Advanced → REST API.


## Requirements
This project has different requirements depending on whether you are running the pre-compiled code or modifying the source code.

### To Run the Deployed Application
* **Node.js 20.0.0 or higher**: The execution environment for the server.
* **NPM (Node Package Manager)**: Required to install dependencies.
* **Express.js**: This project uses the Express framework to function as a web server. It is listed as a dependency and will be installed automatically with npm install.

### External Services
* A publicly accessible WordPress site with the WooCommerce plugin installed and active.
* WooCommerce REST API keys (Consumer Key and Consumer Secret) with Read/Write permissions.
* A WordPress user account (username and application password) with sufficient permissions to interact with WooCommerce.

### To Modify the Source Code (Development)
* All of the above.
* **TypeScript**: The project's source code is written in TypeScript (/src directory). The devDependencies include the necessary TypeScript packages.
* **Build Step**: Before the application can be run, the TypeScript source code must be compiled into JavaScript. This is done by running the build script defined in package.json:

```
# This command compiles the code from /src into JavaScript in the /build directory.
npm run build
```

## License

MIT License - See LICENSE file for details
