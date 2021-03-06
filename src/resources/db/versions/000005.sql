CREATE OR REPLACE FUNCTION updated_at_column_f()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';

-- ---------------------------- FARM ----------------------------

CREATE TABLE farm (
    id BIGSERIAL NOT NULL,
    city_id INTEGER NOT NULL,
    contacts JSONB NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    owner_id BIGINT NOT NULL,
    address TEXT NOT NULL,
    rating SMALLINT NOT NULL DEFAULT 0,
    archive BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT pk_farm PRIMARY KEY (id),
    CONSTRAINT fk_farm_city_id_city FOREIGN KEY(city_id) REFERENCES city (id),
    CONSTRAINT fk_farm_owner_id_users FOREIGN KEY(owner_id) REFERENCES users (id)
);

CREATE INDEX farm_lower_name_gin_idx ON farm USING GIN (lower(name) gin_trgm_ops);

CREATE TRIGGER
    update_farm_updated_at_trigger
BEFORE UPDATE ON
    farm
FOR EACH ROW EXECUTE PROCEDURE
    updated_at_column_f();

-- ---------------------------- ANIMAL_ADD ----------------------------

CREATE TABLE animal_ad (
    id BIGSERIAL NOT NULL,
    animal_breed_id INTEGER NOT NULL,
    sex BOOLEAN,
    cost NUMERIC(9, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    archive BOOLEAN NOT NULL DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    farm_id BIGINT,
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT pk_animal_ad PRIMARY KEY (id),
    CONSTRAINT fk_animal_ad_animal_breed_id_animal_breed FOREIGN KEY(animal_breed_id) REFERENCES animal_breed (id),
    CONSTRAINT fk_animal_ad_farm_id_farm FOREIGN KEY(farm_id) REFERENCES farm (id),
    CONSTRAINT fk_animal_ad_owner_id_users FOREIGN KEY(owner_id) REFERENCES users (id)
);

CREATE INDEX animal_ad_lower_name_gin_idx ON animal_ad USING GIN (lower(name) gin_trgm_ops);

CREATE TRIGGER
    update_animal_ad_updated_at_trigger
BEFORE UPDATE ON
    animal_ad
FOR EACH ROW EXECUTE PROCEDURE
    updated_at_column_f();

CREATE TABLE animal_ad_gallery (
    animal_ad_id BIGINT NOT NULL,
    url TEXT NOT NULL,
    CONSTRAINT fk_animal_ad_gallery_animal_ad_id_animal_ad FOREIGN KEY(animal_ad_id) REFERENCES animal_ad (id)
);

-- ---------------------------- ANIMAL_DOCUMENT ----------------------------

CREATE TABLE animal_document (
    id SERIAL NOT NULL,
    code TEXT NOT NULL,
    display_name TEXT NOT NULL,
    CONSTRAINT pk_animal_document PRIMARY KEY (id),
    CONSTRAINT uq_pet_document_code UNIQUE (code)
);

CREATE TABLE animal_ad_document (
    animal_ad_id BIGINT NOT NULL,
    animal_document_id INTEGER NOT NULL,
    CONSTRAINT fk_animal_ad_document_animal_ad_id_animal_ad FOREIGN KEY(animal_ad_id) REFERENCES animal_ad (id),
    CONSTRAINT fk_animal_ad_document_animal_document_id_animal_document FOREIGN KEY(animal_document_id) REFERENCES animal_document (id)
);
