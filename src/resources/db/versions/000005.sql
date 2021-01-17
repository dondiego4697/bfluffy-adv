CREATE TABLE animal_ad (
    id BIGSERIAL NOT NULL,
    public_id UUID NOT NULL DEFAULT uuid_generate_v1(),
    animal_breed_id INTEGER NOT NULL,
    city_id BIGINT NOT NULL,
    sex JSONB DEFAULT '{}',
    cost NUMERIC(9, 2) NOT NULL,
    birthday TIMESTAMP WITH TIME ZONE,
    title TEXT NOT NULL,
    description TEXT,
    address TEXT,
    is_archive BOOLEAN NOT NULL DEFAULT FALSE,
    is_basic_vaccinations BOOLEAN NOT NULL DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    documents JSONB DEFAULT '{}',
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT pk_animal_ad PRIMARY KEY (id),
    CONSTRAINT fk_animal_ad_animal_breed_id_animal_breed FOREIGN KEY(animal_breed_id) REFERENCES animal_breed (id),
    CONSTRAINT fk_animal_ad_owner_id_users FOREIGN KEY(owner_id) REFERENCES users (id),
    CONSTRAINT fk_animal_ad_city_id_city FOREIGN KEY(city_id) REFERENCES city (id)
);

CREATE INDEX animal_ad_public_id_idx ON animal_ad (public_id);
CREATE INDEX animal_ad_lower_name_gin_idx ON animal_ad USING GIN (lower(name) gin_trgm_ops);

CREATE TRIGGER
    update_animal_ad_updated_at_trigger
BEFORE UPDATE ON
    animal_ad
FOR EACH ROW EXECUTE PROCEDURE
    updated_at_column_f();

CREATE TABLE animal_ad_views_count (
    code TEXT NOT NULL,
    animal_ad_id BIGINT NOT NULL,
    CONSTRAINT fk_animal_ad_views_count_animal_ad_id_animal_ad FOREIGN KEY(animal_ad_id) REFERENCES animal_ad (id),
    CONSTRAINT uq_animal_ad_views_count_code_animal_ad_id UNIQUE (code, animal_ad_id)
);

CREATE OR REPLACE FUNCTION animal_ad_increase_views_count_f()
    RETURNS TRIGGER AS $$
    BEGIN
        UPDATE animal_ad SET views_count = views_count + 1 WHERE id = NEW.animal_ad_id;
        RETURN NEW;
    END;
    $$ language 'plpgsql';

CREATE TRIGGER
    increase_animal_ad_views_count_at_trigger
AFTER INSERT ON
    animal_ad_views_count
FOR EACH ROW EXECUTE PROCEDURE
    animal_ad_increase_views_count_f();

CREATE TABLE animal_ad_gallery (
    animal_ad_id BIGINT NOT NULL,
    url TEXT NOT NULL,
    CONSTRAINT fk_animal_ad_gallery_animal_ad_id_animal_ad FOREIGN KEY(animal_ad_id) REFERENCES animal_ad (id)
);
