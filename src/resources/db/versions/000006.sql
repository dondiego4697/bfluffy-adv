ALTER TABLE farm ADD COLUMN public_id UUID NOT NULL DEFAULT uuid_generate_v1();

CREATE INDEX farm_public_id_gin_idx ON farm (public_id);

ALTER TABLE animal_ad ADD COLUMN public_id UUID NOT NULL DEFAULT uuid_generate_v1();

CREATE INDEX animal_ad_public_id_gin_idx ON farm (public_id);
