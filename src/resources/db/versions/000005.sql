CREATE OR REPLACE FUNCTION updated_at_column_f()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';

CREATE TABLE farm (
    id BIGSERIAL NOT NULL,
    public_id UUID NOT NULL DEFAULT uuid_generate_v1(),
    city_id INTEGER NOT NULL,
    contacts JSONB NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    owner_id BIGINT NOT NULL,
    address TEXT NOT NULL,
    rating SMALLINT NOT NULL DEFAULT 0,
    type TEXT NOT NULL,
    is_archive BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT pk_farm PRIMARY KEY (id),
    CONSTRAINT fk_farm_city_id_city FOREIGN KEY(city_id) REFERENCES city (id),
    CONSTRAINT fk_farm_owner_id_users FOREIGN KEY(owner_id) REFERENCES users (id)
);

CREATE INDEX farm_public_id_idx ON farm (public_id);
CREATE INDEX farm_lower_name_gin_idx ON farm USING GIN (lower(name) gin_trgm_ops);

CREATE TRIGGER
    update_farm_updated_at_trigger
BEFORE UPDATE ON
    farm
FOR EACH ROW EXECUTE PROCEDURE
    updated_at_column_f();
