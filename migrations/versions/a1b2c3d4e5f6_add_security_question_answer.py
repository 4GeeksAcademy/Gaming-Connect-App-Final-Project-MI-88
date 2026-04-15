"""add security_question_answer to user

Revision ID: a1b2c3d4e5f6
Revises: 5884f007d872
Create Date: 2026-04-15 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = '2b85722b7888'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('user', sa.Column('security_question_answer', sa.String(length=255), nullable=True))


def downgrade():
    op.drop_column('user', 'security_question_answer')
