import { pgTable, bigint, timestamp, text, serial, varchar, integer, unique, bigserial, index, uuid, boolean, check, doublePrecision, smallint, foreignKey, date, time, inet, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const notes = pgTable("notes", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "notes_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: text().notNull(),
	text: text(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const migrations = pgTable("migrations", {
	id: serial().primaryKey().notNull(),
	migration: varchar({ length: 255 }).notNull(),
	batch: integer().notNull(),
});

export const translations = pgTable("translations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	status: integer().default(1).notNull(),
	locale: varchar({ length: 255 }).notNull(),
	group: varchar({ length: 255 }).notNull(),
	key: varchar({ length: 255 }).notNull(),
	value: text(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	unique("translations_group_key_locale_unique").on(table.locale, table.group, table.key),
]);

export const passwordResets = pgTable("password_resets", {
	email: varchar({ length: 255 }).notNull(),
	token: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.email.asc().nullsLast().op("text_ops")),
]);

export const telescopeEntries = pgTable("telescope_entries", {
	sequence: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().notNull(),
	batchId: uuid("batch_id").notNull(),
	familyHash: varchar("family_hash", { length: 255 }),
	shouldDisplayOnIndex: boolean("should_display_on_index").default(true).notNull(),
	type: varchar({ length: 20 }).notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.batchId.asc().nullsLast().op("uuid_ops")),
	index().using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index().using("btree", table.familyHash.asc().nullsLast().op("text_ops")),
	index().using("btree", table.type.asc().nullsLast().op("text_ops"), table.shouldDisplayOnIndex.asc().nullsLast().op("text_ops")),
	unique("telescope_entries_uuid_unique").on(table.uuid),
]);

export const telescopeMonitoring = pgTable("telescope_monitoring", {
	tag: varchar({ length: 255 }).primaryKey().notNull(),
});

export const failedJobs = pgTable("failed_jobs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: varchar({ length: 255 }).notNull(),
	connection: text().notNull(),
	queue: text().notNull(),
	payload: text().notNull(),
	exception: text().notNull(),
	failedAt: timestamp("failed_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("failed_jobs_uuid_unique").on(table.uuid),
]);

export const personalAccessTokens = pgTable("personal_access_tokens", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	tokenableType: varchar("tokenable_type", { length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tokenableId: bigint("tokenable_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	token: varchar({ length: 64 }).notNull(),
	abilities: text(),
	lastUsedAt: timestamp("last_used_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.tokenableType.asc().nullsLast().op("int8_ops"), table.tokenableId.asc().nullsLast().op("int8_ops")),
	unique("personal_access_tokens_token_unique").on(table.token),
]);

export const languages = pgTable("languages", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	title: varchar({ length: 255 }),
	locale: varchar({ length: 255 }).notNull(),
	backward: boolean().default(false).notNull(),
	default: boolean().default(false).notNull(),
	active: boolean().default(true).notNull(),
	img: varchar({ length: 255 }),
}, (table) => [
	unique("languages_locale_unique").on(table.locale),
]);

export const currencies = pgTable("currencies", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	symbol: varchar({ length: 255 }),
	title: varchar({ length: 191 }).notNull(),
	rate: doublePrecision().default(sql`'1'`).notNull(),
	position: varchar({ length: 255 }).default('after').notNull(),
	default: boolean().default(false).notNull(),
	active: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	shortCode: varchar("short_code", { length: 255 }),
}, (table) => [
	check("currencies_position_check", sql`("position")::text = ANY ((ARRAY['before'::character varying, 'after'::character varying])::text[])`),
]);

export const categories = pgTable("categories", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().notNull(),
	keywords: varchar({ length: 191 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	parentId: bigint("parent_id", { mode: "number" }).default(sql`'0'`).notNull(),
	type: smallint().default(sql`'1'`).notNull(),
	img: varchar({ length: 255 }),
	active: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.parentId.asc().nullsLast().op("int8_ops")),
	index().using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
]);

export const categoryTranslations = pgTable("category_translations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	categoryId: bigint("category_id", { mode: "number" }).notNull(),
	locale: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 191 }).notNull(),
	description: text(),
}, (table) => [
	index().using("btree", table.locale.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "category_translations_category_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("category_translations_category_id_locale_unique").on(table.categoryId, table.locale),
]);

export const permissions = pgTable("permissions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	guardName: varchar("guard_name", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	unique("permissions_name_guard_name_unique").on(table.name, table.guardName),
]);

export const roles = pgTable("roles", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	guardName: varchar("guard_name", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	unique("roles_name_guard_name_unique").on(table.name, table.guardName),
]);

export const galleries = pgTable("galleries", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	loadableType: varchar("loadable_type", { length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	loadableId: bigint("loadable_id", { mode: "number" }).notNull(),
	type: varchar({ length: 255 }),
	path: varchar({ length: 255 }),
	mime: varchar({ length: 255 }),
	size: varchar({ length: 255 }),
}, (table) => [
	index().using("btree", table.loadableId.asc().nullsLast().op("int8_ops")),
	index().using("btree", table.loadableType.asc().nullsLast().op("text_ops")),
	index().using("btree", table.loadableType.asc().nullsLast().op("int8_ops"), table.loadableId.asc().nullsLast().op("int8_ops")),
]);

export const sessions = pgTable("sessions", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	payload: text().notNull(),
	lastActivity: integer("last_activity").notNull(),
}, (table) => [
	index().using("btree", table.lastActivity.asc().nullsLast().op("int4_ops")),
	index().using("btree", table.userId.asc().nullsLast().op("int8_ops")),
]);

export const metaTags = pgTable("meta_tags", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	path: varchar({ length: 255 }),
	modelId: integer("model_id"),
	modelType: varchar("model_type", { length: 255 }),
	title: varchar({ length: 255 }),
	keywords: varchar({ length: 255 }),
	description: text(),
	h1: varchar({ length: 255 }),
	seoText: text("seo_text"),
	canonical: varchar({ length: 255 }),
	robots: varchar({ length: 255 }),
	changefreq: varchar({ length: 10 }),
	priority: varchar({ length: 10 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const brands = pgTable("brands", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().notNull(),
	title: varchar({ length: 255 }).notNull(),
	active: boolean().default(true).notNull(),
	img: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
]);

export const shopTranslations = pgTable("shop_translations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	shopId: bigint("shop_id", { mode: "number" }).notNull(),
	locale: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 191 }).notNull(),
	description: text(),
	address: varchar({ length: 255 }),
}, (table) => [
	index().using("btree", table.locale.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.shopId],
			foreignColumns: [shops.id],
			name: "shop_translations_shop_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("shop_translations_shop_id_locale_unique").on(table.shopId, table.locale),
]);

export const invitations = pgTable("invitations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	shopId: bigint("shop_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	role: varchar({ length: 255 }),
	status: smallint().default(sql`'1'`).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.shopId],
			foreignColumns: [shops.id],
			name: "invitations_shop_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "invitations_user_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const shopSubscriptions = pgTable("shop_subscriptions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	shopId: bigint("shop_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	subscriptionId: bigint("subscription_id", { mode: "number" }).notNull(),
	expiredAt: date("expired_at"),
	price: doublePrecision(),
	type: varchar({ length: 255 }),
	active: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.shopId],
			foreignColumns: [shops.id],
			name: "shop_subscriptions_shop_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const deliveries = pgTable("deliveries", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	shopId: bigint("shop_id", { mode: "number" }),
	type: varchar({ length: 255 }).default('standard').notNull(),
	price: doublePrecision().default(sql`'0'`).notNull(),
	times: varchar({ length: 255 }),
	note: varchar({ length: 191 }),
	default: boolean().default(false).notNull(),
	active: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const deliveryTranslations = pgTable("delivery_translations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	deliveryId: bigint("delivery_id", { mode: "number" }).notNull(),
	locale: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 191 }).notNull(),
}, (table) => [
	index().using("btree", table.locale.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.deliveryId],
			foreignColumns: [deliveries.id],
			name: "delivery_translations_delivery_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("delivery_translations_delivery_id_locale_unique").on(table.deliveryId, table.locale),
]);

export const subscriptions = pgTable("subscriptions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	type: varchar({ length: 255 }).default('orders').notNull(),
	price: doublePrecision().notNull(),
	month: smallint().notNull(),
	active: boolean().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

export const shops = pgTable("shops", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	tax: doublePrecision().default(sql`'0'`).notNull(),
	deliveryRange: integer("delivery_range"),
	percentage: doublePrecision().default(sql`'0'`).notNull(),
	location: varchar({ length: 255 }),
	phone: varchar({ length: 255 }),
	showType: smallint("show_type"),
	open: boolean().default(true).notNull(),
	visibility: boolean().default(true).notNull(),
	openTime: time("open_time").notNull(),
	closeTime: time("close_time").notNull(),
	backgroundImg: varchar("background_img", { length: 191 }),
	logoImg: varchar("logo_img", { length: 191 }),
	minAmount: doublePrecision("min_amount").default(sql`'0.1'`).notNull(),
	status: varchar({ length: 255 }).default('new').notNull(),
	statusNote: text("status_note"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	mark: varchar({ length: 255 }),
}, (table) => [
	index().using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "shops_user_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	check("shops_status_check", sql`(status)::text = ANY ((ARRAY['new'::character varying, 'edited'::character varying, 'approved'::character varying, 'rejected'::character varying, 'inactive'::character varying])::text[])`),
]);

export const units = pgTable("units", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	active: boolean().default(true).notNull(),
	position: varchar({ length: 255 }).default('after').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	check("units_position_check", sql`("position")::text = ANY ((ARRAY['before'::character varying, 'after'::character varying])::text[])`),
]);

export const unitTranslations = pgTable("unit_translations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	unitId: bigint("unit_id", { mode: "number" }).notNull(),
	locale: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 191 }).notNull(),
}, (table) => [
	index().using("btree", table.locale.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [units.id],
			name: "unit_translations_unit_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("unit_translations_unit_id_locale_unique").on(table.unitId, table.locale),
]);

export const productTranslations = pgTable("product_translations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	productId: bigint("product_id", { mode: "number" }).notNull(),
	locale: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 191 }).notNull(),
	description: text(),
}, (table) => [
	index().using("btree", table.locale.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_translations_product_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("product_translations_product_id_locale_unique").on(table.productId, table.locale),
]);

export const productProperties = pgTable("product_properties", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	productId: bigint("product_id", { mode: "number" }).notNull(),
	locale: varchar({ length: 255 }).notNull(),
	key: varchar({ length: 191 }).notNull(),
	value: text(),
}, (table) => [
	index().using("btree", table.locale.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_properties_product_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const products = pgTable("products", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	shopId: bigint("shop_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	categoryId: bigint("category_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	unitId: bigint("unit_id", { mode: "number" }),
	keywords: varchar({ length: 191 }),
	tax: doublePrecision(),
	minQty: integer("min_qty"),
	maxQty: integer("max_qty"),
	active: boolean().default(false).notNull(),
	img: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	barCode: varchar("bar_code", { length: 255 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	brandId: bigint("brand_id", { mode: "number" }),
}, (table) => [
	index().using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "products_brand_id_foreign"
		}),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "products_category_id_foreign"
		}),
	foreignKey({
			columns: [table.shopId],
			foreignColumns: [shops.id],
			name: "products_shop_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [units.id],
			name: "products_unit_id_foreign"
		}),
]);

export const settings = pgTable("settings", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	key: varchar({ length: 255 }).notNull(),
	value: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	unique("settings_key_unique").on(table.key),
]);

export const extraGroups = pgTable("extra_groups", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	type: varchar({ length: 255 }),
	active: boolean().default(true).notNull(),
});

export const extraGroupTranslations = pgTable("extra_group_translations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	extraGroupId: bigint("extra_group_id", { mode: "number" }).notNull(),
	locale: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 191 }).notNull(),
}, (table) => [
	index().using("btree", table.locale.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.extraGroupId],
			foreignColumns: [extraGroups.id],
			name: "extra_group_translations_extra_group_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("extra_group_translations_extra_group_id_locale_unique").on(table.extraGroupId, table.locale),
]);

export const productExtras = pgTable("product_extras", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	productId: bigint("product_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	extraGroupId: bigint("extra_group_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_extras_product_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const extraValues = pgTable("extra_values", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	extraGroupId: bigint("extra_group_id", { mode: "number" }).notNull(),
	value: varchar({ length: 191 }).notNull(),
	active: boolean().default(true).notNull(),
	hexColor: varchar("hex_color", { length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.extraGroupId],
			foreignColumns: [extraGroups.id],
			name: "extra_values_extra_group_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const stocks = pgTable("stocks", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	countableType: varchar("countable_type", { length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	countableId: bigint("countable_id", { mode: "number" }).notNull(),
	price: doublePrecision().notNull(),
	quantity: integer().default(0).notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	url: text(),
}, (table) => [
	index().using("btree", table.countableId.asc().nullsLast().op("int8_ops")),
	index().using("btree", table.countableType.asc().nullsLast().op("int8_ops"), table.countableId.asc().nullsLast().op("int8_ops")),
	index().using("btree", table.countableType.asc().nullsLast().op("text_ops")),
]);

export const orderDetails = pgTable("order_details", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	orderId: bigint("order_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	shopId: bigint("shop_id", { mode: "number" }).notNull(),
	price: doublePrecision().notNull(),
	tax: doublePrecision().default(sql`'1'`).notNull(),
	commissionFee: doublePrecision("commission_fee"),
	status: varchar({ length: 255 }).default('new').notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	deliveryAddressId: bigint("delivery_address_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	deliveryTypeId: bigint("delivery_type_id", { mode: "number" }),
	deliveryFee: doublePrecision("delivery_fee").default(sql`'0'`).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	deliveryman: bigint({ mode: "number" }),
	deliveryDate: date("delivery_date"),
	deliveryTime: varchar("delivery_time", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.deliveryAddressId.asc().nullsLast().op("int8_ops")),
	index().using("btree", table.deliveryman.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.deliveryAddressId],
			foreignColumns: [userAddresses.id],
			name: "order_details_delivery_address_id_foreign"
		}),
	foreignKey({
			columns: [table.deliveryTypeId],
			foreignColumns: [deliveries.id],
			name: "order_details_delivery_type_id_foreign"
		}),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_details_order_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.shopId],
			foreignColumns: [shops.id],
			name: "order_details_shop_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const orderProducts = pgTable("order_products", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	orderDetailId: bigint("order_detail_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stockId: bigint("stock_id", { mode: "number" }).notNull(),
	originPrice: doublePrecision("origin_price").default(sql`'0'`).notNull(),
	totalPrice: doublePrecision("total_price").default(sql`'0'`).notNull(),
	tax: doublePrecision().default(sql`'0'`).notNull(),
	discount: doublePrecision().default(sql`'0'`).notNull(),
	quantity: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.orderDetailId],
			foreignColumns: [orderDetails.id],
			name: "order_products_order_detail_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.stockId],
			foreignColumns: [stocks.id],
			name: "order_products_stock_id_foreign"
		}),
]);

export const orderCoupons = pgTable("order_coupons", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	name: varchar({ length: 191 }).notNull(),
	price: doublePrecision(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	orderId: bigint("order_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_coupons_order_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const productDiscounts = pgTable("product_discounts", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	productId: bigint("product_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	discountId: bigint("discount_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.discountId],
			foreignColumns: [discounts.id],
			name: "product_discounts_discount_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_discounts_product_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const coupons = pgTable("coupons", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	shopId: bigint("shop_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 255 }).default('fix').notNull(),
	qty: integer().default(0).notNull(),
	price: doublePrecision().default(sql`'0'`).notNull(),
	expiredAt: timestamp("expired_at", { mode: 'string' }).notNull(),
	img: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.shopId],
			foreignColumns: [shops.id],
			name: "coupons_shop_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("coupons_shop_id_name_unique").on(table.shopId, table.name),
	check("coupons_type_check", sql`(type)::text = ANY ((ARRAY['fix'::character varying, 'percent'::character varying])::text[])`),
]);

export const couponTranslations = pgTable("coupon_translations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	couponId: bigint("coupon_id", { mode: "number" }).notNull(),
	locale: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 191 }).notNull(),
	description: text(),
}, (table) => [
	index().using("btree", table.locale.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.couponId],
			foreignColumns: [coupons.id],
			name: "coupon_translations_coupon_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("coupon_translations_coupon_id_locale_unique").on(table.couponId, table.locale),
]);

export const jobs = pgTable("jobs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	queue: varchar({ length: 255 }).notNull(),
	payload: text().notNull(),
	attempts: smallint().notNull(),
	reservedAt: integer("reserved_at"),
	availableAt: integer("available_at").notNull(),
	createdAt: integer("created_at").notNull(),
}, (table) => [
	index().using("btree", table.queue.asc().nullsLast().op("text_ops")),
]);

export const reviews = pgTable("reviews", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	reviewableType: varchar("reviewable_type", { length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	reviewableId: bigint("reviewable_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	rating: doublePrecision().default(sql`'5'`).notNull(),
	comment: text(),
	img: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.reviewableId.asc().nullsLast().op("int8_ops")),
	index().using("btree", table.reviewableType.asc().nullsLast().op("text_ops")),
	index().using("btree", table.reviewableType.asc().nullsLast().op("text_ops"), table.reviewableId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "reviews_user_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const banners = pgTable("banners", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	shopId: bigint("shop_id", { mode: "number" }),
	url: varchar({ length: 191 }),
	type: varchar({ length: 255 }).default('banner').notNull(),
	products: text(),
	img: varchar({ length: 191 }),
	active: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.type.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.shopId],
			foreignColumns: [shops.id],
			name: "banners_shop_id_foreign"
		}),
]);

export const bannerTranslations = pgTable("banner_translations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	bannerId: bigint("banner_id", { mode: "number" }).notNull(),
	locale: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 191 }).notNull(),
	description: text(),
}, (table) => [
	index().using("btree", table.locale.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.bannerId],
			foreignColumns: [banners.id],
			name: "banner_translations_banner_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("banner_translations_banner_id_locale_unique").on(table.bannerId, table.locale),
]);

export const backupHistories = pgTable("backup_histories", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	status: boolean().default(true).notNull(),
	path: varchar({ length: 191 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdBy: bigint("created_by", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "backup_histories_created_by_foreign"
		}),
]);

export const tickets = pgTable("tickets", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdBy: bigint("created_by", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	orderId: bigint("order_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	parentId: bigint("parent_id", { mode: "number" }).default(sql`'0'`).notNull(),
	type: varchar({ length: 255 }).default('question').notNull(),
	subject: varchar({ length: 191 }).notNull(),
	content: text().notNull(),
	status: varchar({ length: 255 }).default('open').notNull(),
	read: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	check("tickets_status_check", sql`(status)::text = ANY ((ARRAY['open'::character varying, 'answered'::character varying, 'progress'::character varying, 'closed'::character varying, 'rejected'::character varying])::text[])`),
]);

export const stockExtras = pgTable("stock_extras", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stockId: bigint("stock_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	extraValueId: bigint("extra_value_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.extraValueId],
			foreignColumns: [extraValues.id],
			name: "stock_extras_extra_value_id_foreign"
		}),
	foreignKey({
			columns: [table.stockId],
			foreignColumns: [stocks.id],
			name: "stock_extras_stock_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const blogs = pgTable("blogs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	type: smallint().default(sql`'1'`).notNull(),
	publishedAt: date("published_at"),
	active: boolean().default(true).notNull(),
	img: varchar({ length: 191 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.type.asc().nullsLast().op("int2_ops")),
	index().using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "blogs_user_id_foreign"
		}),
]);

export const blogTranslations = pgTable("blog_translations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	blogId: bigint("blog_id", { mode: "number" }).notNull(),
	locale: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 191 }).notNull(),
	shortDesc: varchar("short_desc", { length: 191 }),
	description: text(),
}, (table) => [
	index().using("btree", table.locale.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blogs.id],
			name: "blog_translations_blog_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("blog_translations_blog_id_locale_unique").on(table.blogId, table.locale),
]);

export const faqs = pgTable("faqs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().notNull(),
	type: varchar({ length: 255 }),
	active: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
]);

export const faqTranslations = pgTable("faq_translations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	faqId: bigint("faq_id", { mode: "number" }).notNull(),
	locale: varchar({ length: 255 }).notNull(),
	question: text().notNull(),
	answer: text(),
}, (table) => [
	index().using("btree", table.locale.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.faqId],
			foreignColumns: [faqs.id],
			name: "faq_translations_faq_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("faq_translations_faq_id_locale_unique").on(table.faqId, table.locale),
]);

export const transactions = pgTable("transactions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	payableType: varchar("payable_type", { length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	payableId: bigint("payable_id", { mode: "number" }).notNull(),
	price: doublePrecision().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	paymentSysId: bigint("payment_sys_id", { mode: "number" }),
	paymentTrxId: varchar("payment_trx_id", { length: 255 }),
	note: varchar({ length: 255 }),
	performTime: timestamp("perform_time", { mode: 'string' }),
	refundTime: timestamp("refund_time", { mode: 'string' }),
	status: varchar({ length: 255 }).default('progress').notNull(),
	statusDescription: varchar("status_description", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.payableId.asc().nullsLast().op("int8_ops")),
	index().using("btree", table.payableType.asc().nullsLast().op("text_ops")),
	index().using("btree", table.payableType.asc().nullsLast().op("int8_ops"), table.payableId.asc().nullsLast().op("int8_ops")),
	index().using("btree", table.status.asc().nullsLast().op("text_ops")),
	index().using("btree", table.status.asc().nullsLast().op("int8_ops"), table.userId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "transactions_user_id_foreign"
		}),
	check("transactions_status_check", sql`(status)::text = ANY ((ARRAY['progress'::character varying, 'paid'::character varying, 'canceled'::character varying, 'rejected'::character varying])::text[])`),
]);

export const wallets = pgTable("wallets", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	currencyId: bigint("currency_id", { mode: "number" }).notNull(),
	price: doublePrecision().default(sql`'0'`).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.currencyId],
			foreignColumns: [currencies.id],
			name: "wallets_currency_id_foreign"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "wallets_user_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("wallets_uuid_user_id_unique").on(table.uuid, table.userId),
]);

export const walletHistories = pgTable("wallet_histories", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().notNull(),
	walletUuid: uuid("wallet_uuid").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	transactionId: bigint("transaction_id", { mode: "number" }),
	type: varchar({ length: 255 }).default('topup').notNull(),
	price: doublePrecision().default(sql`'0'`).notNull(),
	note: varchar({ length: 255 }),
	status: varchar({ length: 255 }).default('processed').notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdBy: bigint("created_by", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.type.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "wallet_histories_created_by_foreign"
		}),
	foreignKey({
			columns: [table.transactionId],
			foreignColumns: [transactions.id],
			name: "wallet_histories_transaction_id_foreign"
		}),
	unique("wallet_histories_uuid_unique").on(table.uuid),
	check("wallet_histories_status_check", sql`(status)::text = ANY ((ARRAY['processed'::character varying, 'paid'::character varying, 'rejected'::character varying, 'canceled'::character varying])::text[])`),
]);

export const payments = pgTable("payments", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	tag: varchar({ length: 255 }),
	input: smallint().default(sql`'2'`).notNull(),
	clientId: varchar("client_id", { length: 191 }),
	secretId: varchar("secret_id", { length: 191 }),
	sandbox: boolean().default(false).notNull(),
	active: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const paymentTranslations = pgTable("payment_translations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	paymentId: bigint("payment_id", { mode: "number" }).notNull(),
	locale: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	clientTitle: varchar("client_title", { length: 191 }),
	secretTitle: varchar("secret_title", { length: 191 }),
}, (table) => [
	index().using("btree", table.locale.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.paymentId],
			foreignColumns: [payments.id],
			name: "payment_translations_payment_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("payment_translations_payment_id_locale_unique").on(table.paymentId, table.locale),
]);

export const smsGateways = pgTable("sms_gateways", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	title: varchar({ length: 191 }).notNull(),
	from: varchar({ length: 255 }).default('go-shop').notNull(),
	type: varchar({ length: 255 }).notNull(),
	apiKey: varchar("api_key", { length: 255 }),
	secretKey: varchar("secret_key", { length: 255 }),
	serviceId: varchar("service_id", { length: 255 }),
	text: varchar({ length: 191 }),
	active: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const socialProviders = pgTable("social_providers", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	provider: varchar({ length: 255 }).notNull(),
	providerId: varchar("provider_id", { length: 255 }).notNull(),
	avatar: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "social_providers_user_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const likes = pgTable("likes", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	likableType: varchar("likable_type", { length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	likableId: bigint("likable_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.likableId.asc().nullsLast().op("int8_ops")),
	index().using("btree", table.likableType.asc().nullsLast().op("text_ops")),
	index().using("btree", table.likableType.asc().nullsLast().op("int8_ops"), table.likableId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "likes_user_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const termConditions = pgTable("term_conditions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const points = pgTable("points", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	shopId: bigint("shop_id", { mode: "number" }),
	type: varchar({ length: 255 }).default('fix').notNull(),
	price: doublePrecision().default(sql`'0'`).notNull(),
	value: integer().default(0).notNull(),
	active: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.shopId],
			foreignColumns: [shops.id],
			name: "points_shop_id_foreign"
		}),
]);

export const userPoints = pgTable("user_points", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	price: doublePrecision().default(sql`'0'`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_points_user_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const pointHistories = pgTable("point_histories", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	orderId: bigint("order_id", { mode: "number" }).notNull(),
	price: doublePrecision().default(sql`'0'`).notNull(),
	note: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "point_histories_order_id_foreign"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "point_histories_user_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const termConditionTranslations = pgTable("term_condition_translations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	termConditionId: bigint("term_condition_id", { mode: "number" }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	locale: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.locale.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.termConditionId],
			foreignColumns: [termConditions.id],
			name: "term_condition_translations_term_condition_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("term_condition_translations_term_condition_id_locale_unique").on(table.termConditionId, table.locale),
]);

export const discounts = pgTable("discounts", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	shopId: bigint("shop_id", { mode: "number" }).notNull(),
	type: varchar({ length: 255 }).notNull(),
	price: doublePrecision().notNull(),
	start: date().default('2024-12-20').notNull(),
	end: date(),
	active: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	img: varchar({ length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.shopId],
			foreignColumns: [shops.id],
			name: "discounts_shop_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	check("discounts_type_check", sql`(type)::text = ANY ((ARRAY['fix'::character varying, 'percent'::character varying])::text[])`),
]);

export const privacyPolicies = pgTable("privacy_policies", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const privacyPolicyTranslations = pgTable("privacy_policy_translations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	privacyPolicyId: bigint("privacy_policy_id", { mode: "number" }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	locale: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.locale.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.privacyPolicyId],
			foreignColumns: [privacyPolicies.id],
			name: "privacy_policy_translations_privacy_policy_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("privacy_policy_translations_privacy_policy_id_locale_unique").on(table.privacyPolicyId, table.locale),
]);

export const userAddresses = pgTable("user_addresses", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	title: varchar({ length: 191 }).default('My Address').notNull(),
	address: text().notNull(),
	location: varchar({ length: 255 }),
	default: boolean().default(false).notNull(),
	active: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	name: varchar({ length: 255 }),
	surname: varchar({ length: 255 }),
	birthDate: date("birth_date"),
	gender: varchar({ length: 255 }),
	email: varchar({ length: 255 }),
	passportNumber: varchar("passport_number", { length: 255 }),
	passportSecret: varchar("passport_secret", { length: 255 }),
	number: varchar({ length: 255 }),
	userDeliveryId: integer("user_delivery_id"),
	province: varchar({ length: 255 }),
	apartment: varchar({ length: 255 }),
	postcode: varchar({ length: 255 }),
	companyName: varchar("company_name", { length: 255 }),
	city: varchar({ length: 255 }),
	note: varchar({ length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_addresses_user_id_foreign"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const orders = pgTable("orders", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	price: doublePrecision().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	currencyId: bigint("currency_id", { mode: "number" }).notNull(),
	rate: integer().default(1).notNull(),
	note: varchar({ length: 191 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	usdPrice: doublePrecision("usd_price"),
	status: varchar({ length: 255 }),
	totalDeliveryFee: doublePrecision("total_delivery_fee"),
	userAddressId: integer("user_address_id"),
	trackCode: integer("track_code"),
	declarationId: integer("declaration_id"),
	tax: doublePrecision(),
	deliveryId: integer("delivery_id").notNull(),
	countryId: integer("country_id"),
});

export const users = pgTable("users", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().notNull(),
	firstname: varchar({ length: 255 }).default('firstname').notNull(),
	lastname: varchar({ length: 255 }),
	email: varchar({ length: 255 }),
	phone: varchar({ length: 255 }),
	birthday: date(),
	gender: varchar({ length: 255 }).default('male').notNull(),
	emailVerifiedAt: timestamp("email_verified_at", { mode: 'string' }),
	phoneVerifiedAt: timestamp("phone_verified_at", { mode: 'string' }),
	ipAddress: inet("ip_address"),
	active: boolean().default(true).notNull(),
	img: varchar({ length: 255 }),
	firebaseToken: varchar("firebase_token", { length: 255 }),
	password: varchar({ length: 255 }),
	rememberToken: varchar("remember_token", { length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	role: varchar().default('admin'),
	registeredAt: timestamp("registered_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	unique("users_email_unique").on(table.email),
	unique("users_phone_unique").on(table.phone),
	check("users_gender_check", sql`(gender)::text = ANY ((ARRAY['male'::character varying, 'female'::character varying])::text[])`),
]);

export const telescopeEntriesTags = pgTable("telescope_entries_tags", {
	entryUuid: uuid("entry_uuid").notNull(),
	tag: varchar({ length: 255 }).notNull(),
}, (table) => [
	index().using("btree", table.tag.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.entryUuid],
			foreignColumns: [telescopeEntries.uuid],
			name: "telescope_entries_tags_entry_uuid_foreign"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.entryUuid, table.tag], name: "telescope_entries_tags_pkey"}),
]);

export const roleHasPermissions = pgTable("role_has_permissions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	permissionId: bigint("permission_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roleId: bigint("role_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [permissions.id],
			name: "role_has_permissions_permission_id_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "role_has_permissions_role_id_foreign"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.permissionId, table.roleId], name: "role_has_permissions_pkey"}),
]);

export const modelHasPermissions = pgTable("model_has_permissions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	permissionId: bigint("permission_id", { mode: "number" }).notNull(),
	modelType: varchar("model_type", { length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	modelId: bigint("model_id", { mode: "number" }).notNull(),
}, (table) => [
	index().using("btree", table.modelId.asc().nullsLast().op("int8_ops"), table.modelType.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [permissions.id],
			name: "model_has_permissions_permission_id_foreign"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.permissionId, table.modelType, table.modelId], name: "model_has_permissions_pkey"}),
]);

export const modelHasRoles = pgTable("model_has_roles", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roleId: bigint("role_id", { mode: "number" }).notNull(),
	modelType: varchar("model_type", { length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	modelId: bigint("model_id", { mode: "number" }).notNull(),
}, (table) => [
	index().using("btree", table.modelId.asc().nullsLast().op("int8_ops"), table.modelType.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "model_has_roles_role_id_foreign"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.roleId, table.modelType, table.modelId], name: "model_has_roles_pkey"}),
]);
