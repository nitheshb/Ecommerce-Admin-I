import { relations } from "drizzle-orm/relations";
import { categories, categoryTranslations, shops, shopTranslations, invitations, users, shopSubscriptions, deliveries, deliveryTranslations, units, unitTranslations, products, productTranslations, productProperties, brands, extraGroups, extraGroupTranslations, productExtras, extraValues, userAddresses, orderDetails, orders, orderProducts, stocks, orderCoupons, discounts, productDiscounts, coupons, couponTranslations, reviews, banners, bannerTranslations, backupHistories, stockExtras, blogs, blogTranslations, faqs, faqTranslations, transactions, currencies, wallets, walletHistories, payments, paymentTranslations, socialProviders, likes, points, userPoints, pointHistories, termConditions, termConditionTranslations, privacyPolicies, privacyPolicyTranslations, telescopeEntries, telescopeEntriesTags, permissions, roleHasPermissions, roles, modelHasPermissions, modelHasRoles } from "./schema";

export const categoryTranslationsRelations = relations(categoryTranslations, ({one}) => ({
	category: one(categories, {
		fields: [categoryTranslations.categoryId],
		references: [categories.id]
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	categoryTranslations: many(categoryTranslations),
	products: many(products),
}));

export const shopTranslationsRelations = relations(shopTranslations, ({one}) => ({
	shop: one(shops, {
		fields: [shopTranslations.shopId],
		references: [shops.id]
	}),
}));

export const shopsRelations = relations(shops, ({one, many}) => ({
	shopTranslations: many(shopTranslations),
	invitations: many(invitations),
	shopSubscriptions: many(shopSubscriptions),
	user: one(users, {
		fields: [shops.userId],
		references: [users.id]
	}),
	products: many(products),
	orderDetails: many(orderDetails),
	coupons: many(coupons),
	banners: many(banners),
	points: many(points),
	discounts: many(discounts),
}));

export const invitationsRelations = relations(invitations, ({one}) => ({
	shop: one(shops, {
		fields: [invitations.shopId],
		references: [shops.id]
	}),
	user: one(users, {
		fields: [invitations.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	invitations: many(invitations),
	shops: many(shops),
	reviews: many(reviews),
	backupHistories: many(backupHistories),
	blogs: many(blogs),
	transactions: many(transactions),
	wallets: many(wallets),
	walletHistories: many(walletHistories),
	socialProviders: many(socialProviders),
	likes: many(likes),
	userPoints: many(userPoints),
	pointHistories: many(pointHistories),
	userAddresses: many(userAddresses),
}));

export const shopSubscriptionsRelations = relations(shopSubscriptions, ({one}) => ({
	shop: one(shops, {
		fields: [shopSubscriptions.shopId],
		references: [shops.id]
	}),
}));

export const deliveryTranslationsRelations = relations(deliveryTranslations, ({one}) => ({
	delivery: one(deliveries, {
		fields: [deliveryTranslations.deliveryId],
		references: [deliveries.id]
	}),
}));

export const deliveriesRelations = relations(deliveries, ({many}) => ({
	deliveryTranslations: many(deliveryTranslations),
	orderDetails: many(orderDetails),
}));

export const unitTranslationsRelations = relations(unitTranslations, ({one}) => ({
	unit: one(units, {
		fields: [unitTranslations.unitId],
		references: [units.id]
	}),
}));

export const unitsRelations = relations(units, ({many}) => ({
	unitTranslations: many(unitTranslations),
	products: many(products),
}));

export const productTranslationsRelations = relations(productTranslations, ({one}) => ({
	product: one(products, {
		fields: [productTranslations.productId],
		references: [products.id]
	}),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	productTranslations: many(productTranslations),
	productProperties: many(productProperties),
	brand: one(brands, {
		fields: [products.brandId],
		references: [brands.id]
	}),
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	shop: one(shops, {
		fields: [products.shopId],
		references: [shops.id]
	}),
	unit: one(units, {
		fields: [products.unitId],
		references: [units.id]
	}),
	productExtras: many(productExtras),
	productDiscounts: many(productDiscounts),
}));

export const productPropertiesRelations = relations(productProperties, ({one}) => ({
	product: one(products, {
		fields: [productProperties.productId],
		references: [products.id]
	}),
}));

export const brandsRelations = relations(brands, ({many}) => ({
	products: many(products),
}));

export const extraGroupTranslationsRelations = relations(extraGroupTranslations, ({one}) => ({
	extraGroup: one(extraGroups, {
		fields: [extraGroupTranslations.extraGroupId],
		references: [extraGroups.id]
	}),
}));

export const extraGroupsRelations = relations(extraGroups, ({many}) => ({
	extraGroupTranslations: many(extraGroupTranslations),
	extraValues: many(extraValues),
}));

export const productExtrasRelations = relations(productExtras, ({one}) => ({
	product: one(products, {
		fields: [productExtras.productId],
		references: [products.id]
	}),
}));

export const extraValuesRelations = relations(extraValues, ({one, many}) => ({
	extraGroup: one(extraGroups, {
		fields: [extraValues.extraGroupId],
		references: [extraGroups.id]
	}),
	stockExtras: many(stockExtras),
}));

export const orderDetailsRelations = relations(orderDetails, ({one, many}) => ({
	userAddress: one(userAddresses, {
		fields: [orderDetails.deliveryAddressId],
		references: [userAddresses.id]
	}),
	delivery: one(deliveries, {
		fields: [orderDetails.deliveryTypeId],
		references: [deliveries.id]
	}),
	order: one(orders, {
		fields: [orderDetails.orderId],
		references: [orders.id]
	}),
	shop: one(shops, {
		fields: [orderDetails.shopId],
		references: [shops.id]
	}),
	orderProducts: many(orderProducts),
}));

export const userAddressesRelations = relations(userAddresses, ({one, many}) => ({
	orderDetails: many(orderDetails),
	user: one(users, {
		fields: [userAddresses.userId],
		references: [users.id]
	}),
}));

export const ordersRelations = relations(orders, ({many}) => ({
	orderDetails: many(orderDetails),
	orderCoupons: many(orderCoupons),
	pointHistories: many(pointHistories),
}));

export const orderProductsRelations = relations(orderProducts, ({one}) => ({
	orderDetail: one(orderDetails, {
		fields: [orderProducts.orderDetailId],
		references: [orderDetails.id]
	}),
	stock: one(stocks, {
		fields: [orderProducts.stockId],
		references: [stocks.id]
	}),
}));

export const stocksRelations = relations(stocks, ({many}) => ({
	orderProducts: many(orderProducts),
	stockExtras: many(stockExtras),
}));

export const orderCouponsRelations = relations(orderCoupons, ({one}) => ({
	order: one(orders, {
		fields: [orderCoupons.orderId],
		references: [orders.id]
	}),
}));

export const productDiscountsRelations = relations(productDiscounts, ({one}) => ({
	discount: one(discounts, {
		fields: [productDiscounts.discountId],
		references: [discounts.id]
	}),
	product: one(products, {
		fields: [productDiscounts.productId],
		references: [products.id]
	}),
}));

export const discountsRelations = relations(discounts, ({one, many}) => ({
	productDiscounts: many(productDiscounts),
	shop: one(shops, {
		fields: [discounts.shopId],
		references: [shops.id]
	}),
}));

export const couponsRelations = relations(coupons, ({one, many}) => ({
	shop: one(shops, {
		fields: [coupons.shopId],
		references: [shops.id]
	}),
	couponTranslations: many(couponTranslations),
}));

export const couponTranslationsRelations = relations(couponTranslations, ({one}) => ({
	coupon: one(coupons, {
		fields: [couponTranslations.couponId],
		references: [coupons.id]
	}),
}));

export const reviewsRelations = relations(reviews, ({one}) => ({
	user: one(users, {
		fields: [reviews.userId],
		references: [users.id]
	}),
}));

export const bannersRelations = relations(banners, ({one, many}) => ({
	shop: one(shops, {
		fields: [banners.shopId],
		references: [shops.id]
	}),
	bannerTranslations: many(bannerTranslations),
}));

export const bannerTranslationsRelations = relations(bannerTranslations, ({one}) => ({
	banner: one(banners, {
		fields: [bannerTranslations.bannerId],
		references: [banners.id]
	}),
}));

export const backupHistoriesRelations = relations(backupHistories, ({one}) => ({
	user: one(users, {
		fields: [backupHistories.createdBy],
		references: [users.id]
	}),
}));

export const stockExtrasRelations = relations(stockExtras, ({one}) => ({
	extraValue: one(extraValues, {
		fields: [stockExtras.extraValueId],
		references: [extraValues.id]
	}),
	stock: one(stocks, {
		fields: [stockExtras.stockId],
		references: [stocks.id]
	}),
}));

export const blogsRelations = relations(blogs, ({one, many}) => ({
	user: one(users, {
		fields: [blogs.userId],
		references: [users.id]
	}),
	blogTranslations: many(blogTranslations),
}));

export const blogTranslationsRelations = relations(blogTranslations, ({one}) => ({
	blog: one(blogs, {
		fields: [blogTranslations.blogId],
		references: [blogs.id]
	}),
}));

export const faqTranslationsRelations = relations(faqTranslations, ({one}) => ({
	faq: one(faqs, {
		fields: [faqTranslations.faqId],
		references: [faqs.id]
	}),
}));

export const faqsRelations = relations(faqs, ({many}) => ({
	faqTranslations: many(faqTranslations),
}));

export const transactionsRelations = relations(transactions, ({one, many}) => ({
	user: one(users, {
		fields: [transactions.userId],
		references: [users.id]
	}),
	walletHistories: many(walletHistories),
}));

export const walletsRelations = relations(wallets, ({one}) => ({
	currency: one(currencies, {
		fields: [wallets.currencyId],
		references: [currencies.id]
	}),
	user: one(users, {
		fields: [wallets.userId],
		references: [users.id]
	}),
}));

export const currenciesRelations = relations(currencies, ({many}) => ({
	wallets: many(wallets),
}));

export const walletHistoriesRelations = relations(walletHistories, ({one}) => ({
	user: one(users, {
		fields: [walletHistories.createdBy],
		references: [users.id]
	}),
	transaction: one(transactions, {
		fields: [walletHistories.transactionId],
		references: [transactions.id]
	}),
}));

export const paymentTranslationsRelations = relations(paymentTranslations, ({one}) => ({
	payment: one(payments, {
		fields: [paymentTranslations.paymentId],
		references: [payments.id]
	}),
}));

export const paymentsRelations = relations(payments, ({many}) => ({
	paymentTranslations: many(paymentTranslations),
}));

export const socialProvidersRelations = relations(socialProviders, ({one}) => ({
	user: one(users, {
		fields: [socialProviders.userId],
		references: [users.id]
	}),
}));

export const likesRelations = relations(likes, ({one}) => ({
	user: one(users, {
		fields: [likes.userId],
		references: [users.id]
	}),
}));

export const pointsRelations = relations(points, ({one}) => ({
	shop: one(shops, {
		fields: [points.shopId],
		references: [shops.id]
	}),
}));

export const userPointsRelations = relations(userPoints, ({one}) => ({
	user: one(users, {
		fields: [userPoints.userId],
		references: [users.id]
	}),
}));

export const pointHistoriesRelations = relations(pointHistories, ({one}) => ({
	order: one(orders, {
		fields: [pointHistories.orderId],
		references: [orders.id]
	}),
	user: one(users, {
		fields: [pointHistories.userId],
		references: [users.id]
	}),
}));

export const termConditionTranslationsRelations = relations(termConditionTranslations, ({one}) => ({
	termCondition: one(termConditions, {
		fields: [termConditionTranslations.termConditionId],
		references: [termConditions.id]
	}),
}));

export const termConditionsRelations = relations(termConditions, ({many}) => ({
	termConditionTranslations: many(termConditionTranslations),
}));

export const privacyPolicyTranslationsRelations = relations(privacyPolicyTranslations, ({one}) => ({
	privacyPolicy: one(privacyPolicies, {
		fields: [privacyPolicyTranslations.privacyPolicyId],
		references: [privacyPolicies.id]
	}),
}));

export const privacyPoliciesRelations = relations(privacyPolicies, ({many}) => ({
	privacyPolicyTranslations: many(privacyPolicyTranslations),
}));

export const telescopeEntriesTagsRelations = relations(telescopeEntriesTags, ({one}) => ({
	telescopeEntry: one(telescopeEntries, {
		fields: [telescopeEntriesTags.entryUuid],
		references: [telescopeEntries.uuid]
	}),
}));

export const telescopeEntriesRelations = relations(telescopeEntries, ({many}) => ({
	telescopeEntriesTags: many(telescopeEntriesTags),
}));

export const roleHasPermissionsRelations = relations(roleHasPermissions, ({one}) => ({
	permission: one(permissions, {
		fields: [roleHasPermissions.permissionId],
		references: [permissions.id]
	}),
	role: one(roles, {
		fields: [roleHasPermissions.roleId],
		references: [roles.id]
	}),
}));

export const permissionsRelations = relations(permissions, ({many}) => ({
	roleHasPermissions: many(roleHasPermissions),
	modelHasPermissions: many(modelHasPermissions),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	roleHasPermissions: many(roleHasPermissions),
	modelHasRoles: many(modelHasRoles),
}));

export const modelHasPermissionsRelations = relations(modelHasPermissions, ({one}) => ({
	permission: one(permissions, {
		fields: [modelHasPermissions.permissionId],
		references: [permissions.id]
	}),
}));

export const modelHasRolesRelations = relations(modelHasRoles, ({one}) => ({
	role: one(roles, {
		fields: [modelHasRoles.roleId],
		references: [roles.id]
	}),
}));