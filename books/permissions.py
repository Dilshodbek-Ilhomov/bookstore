from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):

    def has_permission(self, request, view):
        # GET, HEAD, OPTIONS for all
        if request.method in SAFE_METHODS:
            return True

        # POST, PUT, PATCH, DELETE only for superuser
        return request.user.is_authenticated and request.user.is_superuser